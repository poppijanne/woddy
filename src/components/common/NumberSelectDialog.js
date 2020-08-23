import React from "react";
import Modal from "./Modal";
import NumberSelect from "./NumberSelect";
import { useSelector, useDispatch } from "react-redux";

export default function NumberSelectDialog() {

    const {show, settings, values, actionGenerator} = useSelector(state => state.numberSelect);
    const dispatch = useDispatch();

    const onClose = e => {
        e.stopPropagation();
        e.preventDefault();
        dispatch({type:"CLOSE NUMBER SELECT"});

    }

    const onNumberSelect = (e, number) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(actionGenerator(number));
        dispatch({type:"CLOSE NUMBER SELECT"});
    }

    if (!show) {
        return (<></>);
    }

    return (
        <Modal title={settings?.title} onClose={onClose}>
            <NumberSelect 
                values={values} 
                min={settings?.min} 
                max={settings?.max} 
                step={settings?.step} 
                columns={settings?.columns}
                onNumberSelect={onNumberSelect}/>
        </Modal>
    )
}