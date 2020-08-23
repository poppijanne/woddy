process.on('uncaughtException', function (e) {
    console.error('Unhandled exception:');
    console.error(e);
    console.error(e.stack);
    process.exit(99);
});

require('dotenv').config();
const express = require('express')
const app = express()
const port = 8080

const nodemailer = require("nodemailer");

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb', extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.SECRET, {
    httpOnly: true
}));

const compression = require('compression');
app.use(compression());

const crypto = require('crypto');

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Setup middlewares
const session = require('express-session');

const FileStore = require('session-file-store')(session);
app.use(
    session({
        store: new FileStore({
            ttl: parseInt(process.env.SESSION_TIMEOUT_SECONDS)
        }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);

/*
if (process.env.NODE_ENV !== "production") {
    const FileStore = require('session-file-store')(session);
    app.use(
        session({
            store: new FileStore({
                ttl: 3600 // seconds
            }),
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false
        })
    );
}
else {
    const MySQLStore = require('express-mysql-session')(session);
    app.use(
        session({
            store: new MySQLStore({},pool),
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false
        })
    );
}
*/


app.use((req, res, next) => {
    req.requestId = req.get('Request-Id') || uuidv4();
    req.requestStart = new Date().getTime();
    next();
});

app.use((req, res, next) => {
    log(`-> ${req.method} ${req.path}`, req);
    //
    res.on("finish", () => {
        log(`<- ${req.method} ${req.path} ${res.statusCode} (${new Date().getTime() - req.requestStart} ms, ${res.getHeader('content-length') || res['_contentLength'] || "?"} bytes) `, req);
    });
    next();
})

app.get('/health', (req, res) => {

    pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) {
            logError(error, req);
            res.json({ ok: false, message: "DATABASE NOT CONNECTED" });
        }
        else {
            res.json({ ok: true });
        }
    });
});

async function query(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(
            query,
            params,
            function (error, results) {
                if (error) {
                    reject(error);
                }
                resolve(results);
            }
        );
    });
}

app.post('/api/v1/user/login', async (req, res) => {

    if (!req.body) {
        res.status(400).send("Request body is required");
        return;
    }

    if (!req.body.email) {
        res.status(400).send("Email is required");
        return;
    }

    if (!req.body.pass) {
        res.status(400).send("Password is required");
        return;
    }

    const emailHash = generateHash(req.body.email, process.env.SECRET);

    try {
        const users = await query("SELECT * FROM `users` WHERE emailHash = ?", emailHash);

        if (users.length === 0) {
            res.status(400).send("Väärä sähköpostiosoite tai salasana");
            return;
        }

        if (validatePassword(req.body.pass, users[0].passHash, users[0].salt + process.env.SECRET)) {

            await query("UPDATE `users` SET ? WHERE userId = ?", [
                {
                    lastLoginTs: new Date().toISOString(),
                    resetPasswordTokenHash: null
                },
                users[0].userId
            ]);

            const user = {
                userId: users[0].userId,
                name: users[0].name,
                settings: JSON.parse(users[0].settings)
            }
            req.session.user = user;
            res.json({ user });
        }
        else {
            res.status(400).send("Väärä sähköpostiosoite tai salasana");
        }
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.post('/api/v1/user/register', async (req, res) => {

    const emailHash = generateHash(req.body.email, process.env.SECRET);

    try {
        const users = await query("SELECT * FROM `users` WHERE emailHash = ?", emailHash);

        if (users.length > 0) {
            res.status(400).send("Sähköpostiosoite on jo käytössä toisella käyttäjällä.");
            return;
        }

        const user = {
            name: req.body.name,
            userId: uuidv4(),
            settings: req.body.settings || {}
        };
        const salt = generateSalt();
        const passHash = generateHash(req.body.pass, salt + process.env.SECRET);
        const fields = {
            userId: user.userId,
            name: user.name,
            emailHash,
            passHash,
            salt,
            settings: JSON.stringify(user.settings)
        };

        await query("INSERT INTO `users` SET ?", fields);

        req.session.user = user;
        res.status(201).json({ user });
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.put('/api/v1/user', async (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    if (!req.body) {
        res.status(400).send("Request body is required");
        return;
    }

    try {
        const users = await query("SELECT * FROM `users` WHERE userId = ?", req.session.user.userId);
        if (users.length === 0) {
            res.sendStatus(404);
            return;
        }

        const user = {
            name: req.body.name || req.session.user.name,
            userId: req.session.user.userId,
            settings: req.body.settings || {}
        };

        const fields = {
            name: user.name,
            settings: JSON.stringify(user.settings)
        };

        await query("UPDATE `users` SET ? WHERE userId = ?", [fields, req.session.user.userId]);

        req.session.user = user;
        res.json({ user });
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.put('/api/v1/user/email', (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    if (!req.body) {
        res.status(400).send("Request body is required");
        return;
    }

    if (!req.body.email) {
        res.status(400).send("Email is required");
        return;
    }

    if (!req.body.pass) {
        res.status(400).send("Password is required");
        return;
    }

    pool.query("SELECT * FROM `users` WHERE userId = ?",
        req.session.user.userId,
        function (error, results) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else if (results.length === 0) {
                res.sendStatus(403);
            }
            else {
                const result = results[0];

                if (validatePassword(req.body.pass, result.passHash, result.salt + process.env.SECRET)) {

                    const emailHash = generateHash(req.body.email, process.env.SECRET);

                    pool.query("UPDATE `users` SET ? WHERE userId = ?",
                        [{ emailHash }, req.session.user.userId],
                        function (error) {
                            if (error) {
                                logError(error, req);
                                res.sendStatus(500);
                            }
                            else {
                                res.sendStatus(204);
                            }
                        }
                    );
                }
                else {
                    res.sendStatus(403);
                }
            }
        }
    );
});

app.delete('/api/v1/users/me', async (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await query("DELETE FROM `workouts` WHERE userId = ?", req.session.user.userId);
        await query("DELETE FROM `users` WHERE userId = ?", req.session.user.userId);
        res.sendStatus(204);
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.put('/api/v1/user/:userId/password', (req, res) => {

    if (!req.params.userId) {
        res.status(400).send("User Id is required");
        return;
    }

    if (!req.body) {
        res.status(400).send("Request body is required");
        return;
    }

    if (!req.body.oldPassword && !req.body.resetPasswordToken) {
        res.status(400).send("Old password or token is required");
        return;
    }

    if (!req.body.newPassword) {
        res.status(400).send("New password is required");
        return;
    }

    pool.query("SELECT * FROM `users` WHERE userId = ?",
        req.params.userId,
        function (error, results) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else if (results.length === 0) {
                res.sendStatus(403);
            }
            else {
                const result = results[0];

                let authorized = false;

                if (req.body.oldPassword) {
                    authorized = validatePassword(req.body.oldPassword, result.passHash, result.salt + process.env.SECRET);
                }
                else if (req.body.resetPasswordToken && result.resetPasswordTokenHash) {
                    authorized = validatePassword(req.body.resetPasswordToken, result.resetPasswordTokenHash, result.salt + process.env.SECRET);
                }

                if (authorized) {

                    const user = {
                        userId: result.userId,
                        name: result.name,
                        settings: JSON.parse(result.settings)
                    }

                    const passHash = generateHash(req.body.newPassword, result.salt + process.env.SECRET);

                    pool.query("UPDATE `users` SET ? WHERE userId = ?",
                        [
                            {
                                passHash,
                                resetPasswordTokenHash: null,
                                lastLoginTs: new Date().toISOString()
                            },
                            result.userId
                        ],
                        function (error) {
                            if (error) {
                                logError(error, req);
                                res.sendStatus(500);
                            }
                            else {
                                req.session.user = user;
                                res.json({ user });
                            }
                        }
                    );
                }
                else {
                    res.sendStatus(403);
                }
            }
        }
    );
});

app.post('/api/v1/user/logout', (req, res) => {
    req.session.user = undefined;
    req.session.destroy((err) => {
        if (err) {
            logError(err, req);
            res.sendStatus(500);
        }
        else {
            log("User logout success");
            res.json({ isLoggedIn: false });
        }
    });
});

app.get('/api/v1/user/me', (req, res) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true, user: req.session.user });
    }
    else {
        res.json({ isLoggedIn: false });
    }
});

// create resetPasswordToken (uuid)
// save resetPasswordToken hash to user
// send email, with link to {PUBLIC_URL}/#/user/:userId/password?token=token
app.post('/api/v1/user/send-reset-password-link', async (req, res) => {

    if (!req.body) {
        res.status(400).send("No request body");
        return;
    }

    if (!req.body.email) {
        res.status(400).send("Email is required");
        return;
    }

    const emailHash = generateHash(req.body.email, process.env.SECRET);

    try {
        log("find user", req);
        const users = await query("SELECT * FROM `users` WHERE emailHash = ?", emailHash);
        if (users.length === 0) {
            res.sendStatus(404);
            return;
        }
        const user = users[0];
        const resetPasswordToken = uuidv4();
        const resetPasswordTokenHash = generateHash(resetPasswordToken, user.salt + process.env.SECRET);

        log("update token", req);
        await query("UPDATE `users` SET ? WHERE userId = ?", [{ resetPasswordTokenHash }, user.userId]);

        log("send mail", req);
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_USER_PASS,
            },
        });

        const url = `${process.env.PUBLIC_URL}/#/user/${user.userId}/password?token=${resetPasswordToken}`;

        // send mail with defined transport object

        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.MAIL_SENDER_ADDRESS}>`,
            to: req.body.email,
            subject: "Salasanan vaihto",
            text: `Vaihda salasana osoitteessa ${url}`,
            html: `
                <div>Jos olet unohtanut salasanasi, klikkaa alla olevaa linkkiä, ja syötä uusi salasana.</div>
                <div>
                    <a href="${url}">Vaihda salasana</a>
                </div>
                <div>Salasanasi ei vaihdu ennen kuin tallennat muutoksen.</div>
                <div>Edellä oleva linkki lakkaa toimimasta, kun olet vaihtanut salasanasi.</div>
                <br/>
                <div>Ystävällisin terveisin,</div>
                <div>${process.env.MAIL_SENDER_NAME}</div>
            `,
        });
        //res.json({ info });
        res.sendStatus(204);
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.post('/api/v1/contact', async (req, res) => {

    if (!req.body) {
        res.status(400).send("No request body");
        return;
    }

    if (!req.body.message) {
        res.status(400).send("Message is required");
        return;
    }

    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_USER_PASS,
            },
        });

        // send mail with defined transport object

        await transporter.sendMail({
            from: req.body.email || `"${process.env.MAIL_SENDER_NAME}" <${process.env.MAIL_SENDER_ADDRESS}>`,
            to: process.env.MAIL_FEEDBACK_ADDRESS,
            subject: "Treenirobotin palaute",
            text: req.body.message,
            html: `<p>${req.body.message}</p>`
        });
        res.sendStatus(204);
    }
    catch (error) {
        logError(error, req);
        res.sendStatus(500);
    }
});

app.get('/api/v1/user/:userId/workouts', (req, res) => {

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const sortOrder = req.query.sortOrder === "ASC" ? "ASC" : "DESC";

    pool.query(`SELECT workoutId, userId, createdTs, modifiedTs, summary FROM workouts WHERE userId = ? ORDER BY ?? ${sortOrder} LIMIT ? OFFSET ?`,
        [
            req.params.userId,
            req.query.sortBy || 'createdTs',
            isNaN(pageSize) ? 50 : pageSize,
            isNaN(page) ? 0 : page
        ],
        function (error, results, fields) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else {
                res.json(results.map(({ workoutId, userId, createdTs, modifiedTs, summary }) => {
                    return {
                        workoutId,
                        userId,
                        createdTs,
                        modifiedTs,
                        summary: JSON.parse(summary)
                    }
                }));
            }
        }
    );
});

app.get('/api/v1/workout/:workoutId', (req, res) => {

    pool.query("SELECT * FROM `workouts` WHERE workoutId = ?",
        req.params.workoutId,
        function (error, results, fields) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else if (results.length === 0) {
                res.sendStatus(404);
            }
            else {
                const workout = JSON.parse(results[0].json);
                res.json(workout);
            }
        }
    );
});

app.post('/api/v1/workout', (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    if (!req.body) {
        res.status(400).send("No request body");
        return;
    }

    if (!req.body.workout) {
        res.status(400).send("Workout is required");
        return;
    }

    if (!req.body.workout.id) {
        res.status(400).send("Workout ID is required");
        return;
    }

    if (req.body.workout.createdTs) {
        res.status(400).send(`Workout has been already created, use PUT`);
        return;
    }

    if (!req.body.summary) {
        res.status(400).send("Workout summary is required");
        return;
    }

    const workout = { ...req.body.workout };

    workout.id = req.body.workout.id || uuidv4();
    workout.createdTs = new Date().toISOString();
    workout.modifiedTs = new Date().toISOString();
    workout.version = 1;

    const fields = {
        workoutId: workout.id,
        userId: req.session.user.userId,
        createdTs: workout.createdTs,
        modifiedTs: workout.modifiedTs,
        json: JSON.stringify(workout),
        summary: JSON.stringify(req.body.summary)
    }

    pool.query("INSERT INTO `workouts` SET ?",
        fields,
        function (error, results, fields) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else {
                res.status(201).json({ workout });
            }
        }
    );
});


app.put('/api/v1/workout', (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    if (!req.body) {
        res.status(400).send("No request body");
        return;
    }

    if (!req.body.workout) {
        res.status(400).send("Workout is required");
        return;
    }

    if (req.body.workout.createdTs === undefined) {
        res.status(400).send(`Workout has not been created previously, use POST`);
        return;
    }

    if (!req.body.summary) {
        res.status(400).send("Workout summary is required");
        return;
    }

    const workout = { ...req.body.workout };

    workout.modifiedTs = new Date().toISOString();
    workout.version++;

    const fields = {
        modifiedTs: workout.modifiedTs,
        json: JSON.stringify(workout),
        summary: JSON.stringify(req.body.summary)
    };

    pool.query("UPDATE `workouts` SET ? WHERE workoutId = ? AND userId = ?",
        [fields, workout.id, req.session.user.userId],
        function (error, results, fields) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else if (results.affectedRows === 0) {
                res.sendStatus(410);
            }
            else {
                res.json({ workout });
            }
        }
    );
});

app.delete('/api/v1/workout/:workoutId', (req, res) => {

    if (!req.session || !req.session.user || !req.session.user.userId) {
        res.sendStatus(401);
        return;
    }

    pool.query("DELETE FROM `workouts` WHERE userId = ? AND workoutId = ?",
        [req.session.user.userId, req.params.workoutId],
        function (error) {
            if (error) {
                logError(error, req);
                res.sendStatus(500);
            }
            else {
                res.sendStatus(204);
            }
        }
    );
});

app.get('/api/v1/exercises', (req, res) => {
    res.json({
        exercises: [
            // Lämmittely
            { name: "Haaraperushyppy", muscles: ["Jalat"], tags: ["Lämmittely", "Kehonpaino", "Jalat"] },
            { name: "Hiihto", muscles: ["Jalat"], tags: ["Lämmittely", "Kehonpaino", "Jalat"] },
            { name: "Nyrkkeily", muscles: ["Jalat", "Kädet"], tags: ["Lämmittely", "Kehonpaino", "Kädet"] },
            { name: "Nopeat jalat", muscles: ["Jalat"], tags: ["Lämmittely", "Kehonpaino", "Jalat"] },
            { name: "Mittarimato", muscles: ["Vatsat", "Jalat", "Olkapäät", "Yläselkä", "Rinta", "Ojentajat", "Pakarat", "Takareidet"], tags: ["Lämmittely", "Kehonpaino"] },
            // Jalat + pakarat
            { name: "Askelkyykky + nytkytys", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Askelkyykky sivulle", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Askelkyykky eteen", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Askelkyykky taakse", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Askelkyykky + polven nosto", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Askelkyykky + kuula jalan alta", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"] },
            { name: "Askelkyykky + pystypunnerrus", equipment: ["Kahvakuula"], muscles: ["Jalat", "Kädet"], tags: ["Jalat"] },
            { name: "Askelkyykky + työntö", equipment: ["Kahvakuula"], muscles: ["Jalat", "Kädet"], tags: ["Jalat", "Kädet"] },
            { name: "Sissikyykky polvillaan", equipment: ["Matto"], muscles: ["Jalat", "Vatsat"], tags: ["Kehonpaino", "Jalat"] },
            { name: "Kahdeksikko", equipment: ["Kahvakuula"], muscles: ["Jalat"], tags: ["Jalat"] },
            { name: "Thruster yhdellä kädellä", equipment: ["Kahvakuula"], muscles: ["Jalat", "Pakarat"], tags: ["Jalat"], sideSwitch: true },
            { name: "Kyykky", equipment: ["Kahvakuula"], muscles: ["Jalat", "Takamus"], tags: ["Jalat"] },
            { name: "Kyykky + pystypunnerrus", equipment: ["Kahvakuula"], muscles: ["Jalat", "Takamus", "Kädet", "Hartiat"], tags: ["Jalat", "Kädet"] },
            { name: "Sumokyykky", equipment: ["Kahvakuula"], muscles: ["Jalat", "Pakarat"], tags: ["Jalat"] },
            { name: "Sumokyykky + pystysoutu", equipment: ["Kahvakuula"], muscles: ["Kädet", "Jalat", "Pakarat"] },
            { name: "Pissaava koira", equipment: ["Matto"], muscles: ["Pakarat"], tags: ["Kehonpaino"], sideSwitch: true },
            // Kädet / ylävartalo
            { name: "Hauiskääntö", muscles: ["Kädet", "Hauikset"], equipment: ["Kahvakuula"], tags: ["Kädet"] },
            { name: "Halo", muscles: ["Kädet", "Hartiat"], equipment: ["Kahvakuula"], tags: ["Kädet"] },
            { name: "Halo + hauiskääntö", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hartiat", "Hauikset"], tags: ["Kädet"] },
            { name: "Ojentajat", equipment: ["Kahvakuula"], muscles: ["Kädet", "Ojentajat"], tags: ["Kädet"] },
            { name: "Pystysoutu", equipment: ["Kahvakuula"], muscles: ["Kädet"], tags: ["Kädet"] },
            { name: "Työntö rinnalta", equipment: ["Kahvakuula"], muscles: ["Kädet"], tags: ["Kädet"], sideSwitch: true },
            { name: "Työntö selinmakuulta", equipment: ["Kahvakuula", "Matto"], muscles: ["Kädet"], tags: ["Kädet"], sideSwitch: true },
            { name: "Hauiskääntö + pystypunnerrus", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hauis", "Hartiat"], tags: ["Kädet"] },
            { name: "Hauiskääntö + ojentajat", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hauis", "Ojentajat", "Hartiat"], tags: ["Kädet"] },
            { name: "Pystypunnerrus", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hartiat"], tags: ["Kädet"] },
            { name: "Pystypunnerrus + ojentajat", equipment: ["Kahvakuula"], muscles: ["Kädet", "Ojentajat", "Hartiat"], tags: ["Kädet"] },
            { name: "Kulmasoutu", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hauis", "Kyljet"], tags: ["Kädet"], sideSwitch: true },
            { name: "Kulmasoutu punnerrusasennossa", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Kädet", "Hauis", "Kyljet"], tags: ["Kädet"], sideSwitch: true },
            { name: "Punnerrus", muscles: ["Kädet", "Rinta"], tags: ["Kehonpaino", "Kädet"] },
            { name: "Nytkypunnerrus", muscles: ["Kädet", "Rinta"], tags: ["Kehonpaino", "Kädet"] },
            { name: "Pistoolityöntö", equipment: ["Kahvakuula (pieni)"], muscles: ["Kädet", "Hartiat", "Hauikset"], tags: ["Kädet"], sideSwitch: true },
            { name: "Nyrkkeily kuulalla", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hartiat", "Kyljet"], tags: ["Kädet"] },
            { name: "Kyljet", equipment: ["Kahvakuula"], muscles: ["Kyljet"], tags: ["Core"] },
            { name: "Tuulimylly", equipment: ["Kahvakuula"], muscles: ["Kyljet"], tags: ["Core"] },
            // Vatsat / selkä
            { name: "Russian Twist", equipment: ["Kahvakuula", "Matto"], muscles: ["Vatsat", "Kyljet"], tags: ["Vatsat"] },
            { name: "Kantapäiden kosketus", muscles: ["Vatsat", "Kyljet"], tags: ["Kehonpaino", "Vatsat"] },
            { name: "Pull Over", equipment: ["Kahvakuula", "Matto"], muscles: ["Vatsat"], tags: ["Vatsat"] },
            { name: "Knee Grab", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Vatsat"] },
            { name: "Kyynärpää-polvi rutistus", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Vatsat"] },
            { name: "Linkkari", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Vatsat"] },
            { name: "Uimari", muscles: ["Selkä"], tags: ["Kehonpaino"] },
            // Core
            { name: "Etuheilautus ja pistoolityöntö lankkuasennosta", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hartiat", "Kyljet"], tags: ["Core", "Sykeliike"] },
            { name: "Etuheilautus kahdella kädellä", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core"] },
            { name: "Etuheilautus yhdellä kädellä", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core"], sideSwitch: true },
            { name: "Etuheilautus käden vaihdolla", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core"] },
            { name: "Puolikuu", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat"], tags: ["Core"] },
            { name: "Etuheilautus ja kyykky", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core", "Sykeliike"] },
            { name: "Tempaus", equipment: ["Kahvakuula"], muscles: ["Kädet", "Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core", "Kädet"], sideSwitch: true },
            { name: "Tempaus kahdella kädellä", equipment: ["Kahvakuula"], muscles: ["Kädet", "Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core", "Kädet"] },
            { name: "Rinnalle veto", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Jalat", "Kädet", "Hartiat"], tags: ["Core"], sideSwitch: true },
            { name: "Kyykky + rinnalle veto", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Jalat", "Pakarat", "Kädet", "Hartiat"], tags: ["Core"], sideSwitch: true },
            { name: "Lankku", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Core", "Vatsat"], tempo: 0 },
            { name: "Kylkilankku", equipment: ["Matto"], muscles: ["Vatsa, Kyljet"], tags: ["Kehonpaino", "Core"], tempo: 0, sideSwitch: true },
            // Sykeliikkeet
            { name: "Burbees", muscles: ["Kädet", "Vatsat", "Jalat"], tags: ["Kehonpaino", "Sykeliike"] },
            { name: "Burbees + pystysoutu", equipment: ["Kahvakuula"], muscles: ["Kädet", "Vatsat", "Jalat"], tags: ["Sykeliike"] },
            { name: "Mittarimatoburbees", muscles: ["Kädet", "Vatsat", "Jalat"], tags: ["Kehonpaino", "Sykeliike"] },
            { name: "Kyykkyhyppy", muscles: ["Pakarat", "Jalat"], tags: ["Kehonpaino", "Sykeliike", "Jalat"] },
            { name: "Heinäsirkka", muscles: ["Pakarat", "Jalat"], tags: ["Kehonpaino", "Sykeliike", "Jalat"] },
            { name: "Sit Through", muscles: ["Vatsat"], tags: ["Kehonpaino", "Sykeliike"] },
            { name: "Jalkatyö", muscles: ["Jalat"], tags: ["Kehonpaino", "Sykeliike"] },
            { name: "Vuorikiipeily", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Sykeliike", "Vatsat"] },
            { name: "Kyynärpäille laskeutuminen lankkuasennosta", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino", "Sykeliike"], sideSwitch: true },
            { name: "Turkkilainen nousu", equipment: ["Kahvakuula"], muscles: ["Jalat", "Kädet", "Vatsat"], tempo: 0, sideSwitch: true },
        ]
    })
});

const options = {
    extensions: ['html'],
    setHeaders: function (res, path, stat) {
        if (!path.endsWith(".html")) {
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}

app.use('/', express.static(__dirname + '/build', options));

app.listen(port, () => {
    log(`Woddy listening at port ${port}`)
    log(`Node version:        ${process.versions.node}`)
    log(`NODE_ENV:            ${process.env.NODE_ENV}`)
    log(`PUBLIC_URL:          ${process.env.PUBLIC_URL}`)
    log(`SECRET:              ${process.env.SECRET ? 'configured' : 'undefined'}`)
    log(`Database configured: ${process.env.DB_USER !== undefined && process.env.DB_PASS !== undefined && process.env.DB_NAME !== undefined}`)
    log(`Mail configured:     ${process.env.MAIL_HOST !== undefined && process.env.MAIL_USER !== undefined && process.env.MAIL_USER_PASS !== undefined}`)
    log(`Feedback email:      ${process.env.MAIL_FEEDBACK_ADDRESS !== undefined}`)
});

// UTILS

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

function generateHash(value, salt) {
    return crypto.pbkdf2Sync(value, salt, 1000, 64, `sha512`).toString(`hex`);
}

function validatePassword(password, passHash, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return passHash === hash;
}

function log(message, { requestId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", session = { user: {} } } = {}) {
    console.log(`LOG ${(session.user && session.user.userId) || '---------anonymous-user---------'} ${requestId} ${new Date().toISOString()} ${message}`);
}

function logError(error, { requestId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", session = { user: {} } } = {}) {
    console.error(`ERR ${(session.user && session.user.userId) || '---------anonymous-user---------'} ${requestId} ${new Date().toISOString()} ${error.message ? error.message : error}`);
    console.error(error);
}
