import { IconButton } from "@material-ui/core";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import React, { createRef } from "react";
import styles from "./styles.module.scss";

const FileUploader = ({ onFilesAdded, input }) => {
    const inputRef = createRef();
    const openFileDialog = () => {
        if (input.fileAreaDisabled) return;
        inputRef.current.click();
    };

    const uploadFile = (event) => {
        if (input.fileAreaDisabled) return;
        if (onFilesAdded) {
            onFilesAdded(input.name, input.fileAcceptMultiple, event.target.files);
        }
    };

    return (
        <>
            <IconButton onClick={!input.fileAreaDisabled ? openFileDialog : undefined}>
                <AttachFileIcon />
            </IconButton>
            {input.fileAreaIcon}
            {input.fileAreaTitle && (
                <p
                    style={{ fontSize: input.fileAreaTitle.size }}
                    className={styles.input_title}
                >
                    {input.fileAreaTitle.text}
                </p>
            )}
            {input.fileAreaDescription && (
                <p
                    className={styles.input_description}
                    style={{ fontSize: input.fileAreaDescription.size }}
                >
                    {input.fileAreaDescription.text}
                </p>
            )}
            <input
                ref={inputRef}
                className={styles.file_input}
                type="file"
                multiple={!!input.fileAcceptMultiple}
                onChange={uploadFile}
                accept={input.fileType ? input.fileType : "image/*"}
            />
        </>
    );
};

export default FileUploader;
