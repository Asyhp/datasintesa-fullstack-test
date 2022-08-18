import { Box, Button, Container, LinearProgress, Paper, TextField, Toolbar } from '@mui/material';
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase';
import Table from "@mui/material/Table";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function AddFile() {
    return (
        <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ backgroundColor: (theme) => 
            theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : them.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto"}}>
            <Toolbar/>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4}}>
            <FormAddFile />
            <GetFile />
            </Container>    
            </Box>
        </Box>
    )
}

function FormAddFile() {
    const router = useRouter();
    const [file, setFile] = useState();
    const [progress, setProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState([]);
    const [errorInput, setErrorInput] = useState(false);

    function inputFile(e) {
        if (!e.target.files) {
            return setFile(undefined)
        }
        setFile(e.target.files[0]);
    }


useEffect(() => {
    if (file) {
        handleUpload()
    }
}, [file])

function handleUpload() {
    const storageRef = ref(storage, `file/${Date.now()}+${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
        'state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress)
        },
        (error) => {
            console.log(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=> {
                setFileUrl(prev => [...prev, downloadUrl])
            }); 
        }
    );
};

return (
    <Formik initialValues={{
        resultTime: '',
        endobedId: '',
        cellId: '',
        availDur: ''
    }}
    onSubmit= {async (values) => {
        if (errorInput) return
        const res = await fetch(`http://localhost:4000/`, {
            method: 'POST',
            body: JSON.stringify({
                resultTime: values.resultTime,
                endobedId: values.objectName,
                cellId: values.objectName,
                availDur: values.availDur
            }),
            headers: {"Content-Type": "application/json"}
        })
        const data = await res.json()
        if (res.status === 201) {
            router.push('/')
        }
        if (res.status === 400) {
            console.log(data)
        }
    }}>
        {
            formik => (
                <Paper component={Form}
                    elevation={10}
                    sx={{
                        width: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1, mt: 1, mx: 'auto',
                        '& .MuiTextField-root': { my:1, width: '100%'}
                    }}
                >
                    <Box sx={{width: '100%', height: '100px', overflowX: 'auto', overflowY: 'hidden'}}>
                        <Box sx={{width: 'auto', display:'flex', height:'100%' }}>
                            {
                                fileUrl.map((value, idx) => {
                                    <Box key={idx} sx={{width: '100px', height:'100%', flexShrink: '0', mx:1, position:'relative'}}>
                                        <Box component="img" sx={{ height: '100px', width: '100px',}} src={value} loading='lazy' />
                                    </Box>

                                })
                            }
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress variant='determinate' value={progress} />
                    </Box>
                    <TextField id='file'
                    name='file'
                    type='file'
                    inputProps={"file/*"}
                    onChange={inputFile}
                    onClick={() => {setErrorInput(false)}}
                    {...(errorInput) ? errorInput: null}
                    />
                    <Button sx={{mt:1}} 
                        type="submit" 
                        color="info" 
                        variant="contained"
                        onClick={() => {
                        if (!fileUrl.length) return setErrorInput({
                        error: true,
                        helperText: 'silahkan upload file'
                        })
                     }} >
                        ADD FILE
                    </Button>
                </Paper>
            )
        }
    </Formik>
)
}

function GetFile() {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        const {rows} = await fetch(`http://localhost:4000/`, {
        })
        setFileList(rows)
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center">Result Time</TableCell>
                    <TableCell align="center">eNodeB Id</TableCell>
                    <TableCell align="center">Cell Id</TableCell>
                    <TableCell align="center">Avail Dur</TableCell>
                </TableRow>
                </TableHead>
            <TableBody>
                {fileList.map((file) => {
                return (
                    <TableRow
                    key={file.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="center">{file.resultTime}</TableCell>
                        <TableCell align="center">{file.objectName}</TableCell>
                        <TableCell align="center">{file.objectName}</TableCell>
                        <TableCell align="center">{file.availDur}</TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
        </Table>
        </TableContainer>
    )
}
