import React, { useState } from 'react';
import { useMessageContext, useChatContext, ReactionSelector } from 'stream-chat-react';
import styles from './customMessage.module.scss';

function CustomMessage() {
    const { message } = useMessageContext();
    const { client } = useChatContext();
    const isCurrentUser = message.user.id === client.user.id;

    const [showReactionSelector, setShowReactionSelector] = useState(false);

    const toggleReactionSelector = () => {
        setShowReactionSelector(prev => !prev);
    };

    return (
        <div className={`
            ${styles.customMessageContentWrapper} 
            ${isCurrentUser ? styles.currentUserMessage : ""}
        `}>
            {message.user && message.user.name && (
                <div className={styles.userName}>{message.user.name}</div>
            )}

            <div className={styles.messageContent}>{message.text}</div>


            {message.latest_reactions &&
                Array.isArray(message.latest_reactions) &&
                message.latest_reactions.length > 0 &&
                (
                    <div className={styles.messageActions}>
                        {message.latest_reactions.map((reaction, index) => (
                            <span
                                key={reaction.type + index}
                                className={styles.reactionEmoji}
                            >
                                {reaction.type}
                                {reaction.user_id_count > 1 && reaction.user_id_count}
                            </span>
                        ))}
                    </div>
                )}
            <div>
                <button
                    className={styles.reactButton}
                    onClick={toggleReactionSelector}
                >😊
                </button>
                {showReactionSelector && (
                    <ReactionSelector message={message} />
                )}
            </div>
        </div>
    );
}

export default CustomMessage;