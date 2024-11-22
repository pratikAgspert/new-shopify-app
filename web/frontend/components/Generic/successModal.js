import React, {useState} from 'react';
import { Dimensions } from 'react-native';
import Modal from 'react-modal';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const SuccessModal = ({ toggle, open, text }) => {

  const [isOpen, setIsOpen] = useState(true);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderWidth: 1,
      backgroundColor:'white'
    },
  };

  return (
    <div>
      <Modal isOpen={open} style={customStyles} contentLabel="Example Modal" overlayClassName='Overlay'>
          <div style={{minWidth:width*0.3, display:'flex', alignItems:'center', flexDirection:'column'}}>
          <div style={{margin: 20, marginLeft: 40, marginRight: 40}}>
              <img src="assets/images/Check.png" width="70" height="70"></img>
          </div>
        <div>
            <div style={{textAlign:"justify", display:'flex', flexDirection:'column', alignItems:'center'}}>
                {text.split('\n').map((item, index)=>(
                    <div key={index}>{item}</div>
                ))}
            </div>
        
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
            }}
          >
            <button
              style={{
                backgroundColor: "rgba(0,184,148)",
                borderWidth: 0,
                borderRadius: 5,
                color: "white",
                padding: 5,
                paddingLeft: 40,
                paddingRight: 40,
              }}
              onClick={() => {
                  toggle(false)
                }}
            >
              OK
            </button>
          </div>
        </div>
        </div>
      </Modal>
    </div>
  );
};