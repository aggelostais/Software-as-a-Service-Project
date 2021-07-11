import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({

    table: {
        Width: 150,
        height:300
    }
});

export default function QuestionsPerKeyword(){

    const [keywords, setKeywords] = useState([]);

    function createData(keyword, questions) {
        return {keyword,questions};
    }

    // Gets backend array and saves data
    const fetchQuestions = async () => {
        const res = await axios.get('http://localhost:3015/questionsPerKeyword');
        setKeywords(res.data);
        console.log(keywords);
    };

    // Performs side effect after each render (backend call)
    useEffect(() => {
        fetchQuestions();
        console.log(keywords);
    },[]); // why use deps [] ?

    // Inserts data into rows
    const rows = [
        createData(keywords[0],keywords[1]),
        createData(keywords[2],keywords[3]),
        createData(keywords[4],keywords[5]),
        createData(keywords[6],keywords[7]),
        createData(keywords[8],keywords[9]),
    ];

    const classes = useStyles();

    return (
        <div>
        <Typography variant="body1" gutterBottom
                    style={{
                        fontWeight:"bold", fontSize: 20}}>
            Questions per Keyword
        </Typography>
        <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" >
                                <Typography variant="body1" gutterBottom
                                            style={{fontWeight:"bold"}}>
                                    Keyword
                                </Typography>
                            </TableCell>
                            <TableCell align="left" >
                                <Typography variant="body1" gutterBottom
                                            style={{fontWeight:"bold"}}>
                                    Questions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell align="left" >
                                    <Typography variant="body1">
                                        {row.keyword}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" >
                                    <Typography variant="body1">
                                        {row.questions}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}