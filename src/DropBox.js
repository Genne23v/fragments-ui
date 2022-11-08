import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Box, Typography } from '@mui/material';
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';

export const DropBox = (props) => {
    const { onDrop } = props;
    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: [NativeTypes.FILE],
            drop(item) {
                if (onDrop) {
                    onDrop(item);
                }
            },
            canDrop(item) {
                console.log('canDrop', item.files, item.items);
                return true;
            },
            hover(item) {
                console.log('hover', item.files, item.items);
            },
            collect: (monitor) => {
                const item = monitor.getItem();
                if (item) {
                    console.log('collect', item.files, item.items);
                }
                return {
                    isOver: monitor.isOver(),
                    canDrop: monitor.canDrop(),
                };
            },
        }),
        [props]
    );
    const isActive = canDrop && isOver;

    return (
        <Box
            sx={{
                width: 600,
                height: 120,
                border: '1px solid lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                    backgroundColor: '#eee',
                },
            }}
            ref={drop}>
            <AttachFileSharpIcon />
            <Typography variant='body2'>
                {isActive ? 'Release to drop' : 'Drag file here'}
            </Typography>
        </Box>
    );
};
