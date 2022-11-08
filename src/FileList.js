import { useMemo } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FileUploadSharpIcon from '@mui/icons-material/FileUploadSharp';

function listFiles(files) {
    const label = (file) =>
        `${file.name}' of size '${file.size}' and type '${file.type}`;
    if (files.length > 0) {
        return files.map((file) => (
            <ListItem key={file.name}>
                <ListItemIcon>
                    <FileUploadSharpIcon />
                </ListItemIcon>
                <ListItemText>{label(file)}</ListItemText>
            </ListItem>
        ));
    } else {
        return;
    }
}

export const FileList = ({ files }) => {
    let fileInfo = useMemo(() => listFiles(files), [files]);
    return <List>{fileInfo}</List>;
};
