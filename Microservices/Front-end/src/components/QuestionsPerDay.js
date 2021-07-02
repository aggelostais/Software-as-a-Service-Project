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

export default function QuestionsPerDay() {

    const [dates, setDates] = useState([]);

    function createData(date, questions) {
        return {date, questions};
    }

    // Backend call
    const fetchQuestions = async () => {
        const res = await axios.get('http://localhost:3015/questionsPerDay');
        setDates(res.data);
        console.log(dates);
    };

    // Performs this side effect after each render
    useEffect(() => {
        fetchQuestions();
        console.log(dates);
    }, []); // why use deps [] ?

    // Inserts data into rows
    const rows = [
        createData(dates[0], dates[1]),
        createData(dates[2], dates[3]),
        createData(dates[4], dates[5]),
        createData(dates[6], dates[7]),
        createData(dates[8], dates[9]),
    ];

    const classes = useStyles();

    return (
        <div>
            <Typography variant="body1" gutterBottom
                        style={{
                            fontWeight:"bold", fontSize: 20}}>
                Questions per Date
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Typography variant="body1" gutterBottom
                                            style={{fontWeight:"bold"}}>
                                    Date
                                </Typography>
                            </TableCell>
                            <TableCell align="left">
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
                                        {row.date}
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
