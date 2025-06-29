import React, { useState } from "react";
import { ChatAutoComplete, useMessageInputContext } from "stream-chat-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
//import '@emoji-mart/react/dist/style.css';
import styles from "./Chat.module.scss";

function CustomInput() {
    const { handleSubmit, value, setValue } = useMessageInputContext();
    const [showPicker, setShowPicker] = useState(false);

    const handleEmojiSelect = (emoji) => {
         console.log("Emoji seleccionado:", emoji.native);
        setValue(value + emoji.native);
        console.log("Nuevo valor:", value);
        setShowPicker(false);
    };

    return (
        <div className={styles.strChatInputFlat}>
            <div className={styles.strChatInputFlatWrapper}>
                <div className={styles.strChatInputFlatTextareaWrapper}>
                    <ChatAutoComplete />
                </div>
                <button onClick={handleSubmit}>Send Message</button>
                <button onClick={() => setShowPicker(!showPicker)}>
                    <span role="img" aria-label="emoji">😊</span>
                </button>
                {showPicker && (
                    <div style={{ position: 'absolute', bottom: '100%', left: '0', zIndex: '1' }}>
                        <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                    </div>
                )}
            </div>
            <div>Valor actual: {value}</div>
        </div>
    );
}

export default CustomInput;