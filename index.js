import React from 'react';
import ModalComponent from './Component';

const ComponentRef = React.createRef()
const openPopUp = ComponentRef.current.onOpenModal

export { openPopUp }
export default ModalComponent