import React from "react";
import axios from "axios/index";

import '../../../HomeTemplate/vendor/bootstrap/css/bootstrap.min.css';
import '../../../HomeTemplate/vendor/font-awesome/css/font-awesome.min.css';
import '../../../HomeTemplate/css/grayscale.min.css';
import '../../../css/custom.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import '../../../css/loader.css'
import {withRouter} from 'react-router-dom'

import {EMPLOYEE_API_URL} from "../../../config";
//let API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/internattendance';



class EmployeeTable extends React.Component{
    constructor(props){
        super(props);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var m = mm.toString();
        var d = dd.toString();
        if (mm < 10) {
            m = "0" + mm.toString();
        }
        if (dd < 10) {
            d = "0" + dd.toString();
        }
        var yyyy = today.getFullYear();
        var dateForSearch = yyyy.toString() + '-' + m.toString() + '-' + d.toString();
        var monthForSearch = yyyy.toString() + '-' + m.toString();
        this.state={
            search: dateForSearch,
            searchmonth: monthForSearch,
            info:[],
            monthlyinfo:[],
            dateDisplayField:'',
            monthDisplayField:'',

            thisYear:0,
            thisMonth:0,
            thisValue:0,
            comment:'',

            events:[],
            event_description:[],
            SubstituteLeaveClicked:false,
            SubstituteDate:0,

            RemainingSickLeave:0,
            RemainingAnnualLeave:0,
            RemainingSubstituteLeave:0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChange1= this.handleChange1.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.monthlyRequestToApi = this.monthlyRequestToApi.bind(this);
        this.handleCommentSubmit= this.handleCommentSubmit.bind(this);
    }

    //Function to change integer month value to string month value.
    getThisMonth(m) {
        if (m === 1) {
            return ("January");
        }
        else if (m === 2) {
            return ("February");
        }
        else if (m === 3) {
            return ("March");
        }
        else if (m === 4) {
            return ("April");
        }
        else if (m === 5) {
            return ("May");
        }
        else if (m === 6) {
            return ("June");
        }
        else if (m === 7) {
            return ("July");
        }
        else if (m === 8) {
            return ("August");
        }
        else if (m === 9) {
            return ("September");
        }
        else if (m === 10) {
            return ("October");
        }
        else if (m === 11) {
            return ("November");
        }
        else if (m === 12) {
            return ("December");
        }
    }
    getThisMonthInNumber(m){
        if (m === "January") {
            return (1);
        }
        else if (m === "February") {
            return (2);
        }
        else if (m === "March") {
            return (3);
        }
        else if (m === "April") {
            return (4);
        }
        else if (m === "May") {
            return (5);
        }
        else if (m === "June") {
            return (6);
        }
        else if (m === "July") {
            return (7);
        }
        else if (m === "August") {
            return (8);
        }
        else if (m === "September") {
            return (9);
        }
        else if (m === "October") {
            return (10);
        }
        else if (m === "November") {
            return (11);
        }
        else if (m === "December") {
            return (12);
        }
    }
    getDaysInMonth(ma) {
        var a = 30;
        var li=ma.split(' ');
        var y = li[1] % 4;
        var m = this.getThisMonthInNumber(li[0]);
        if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
            a = 31;
        }
        else if (y === 0 && m === 2) {
            a = 29;
        }
        else if (y !== 0 && m === 2) {
            a = 28;
        }
        else {
            a = 30;
        }
        return a;
    }
    handleChange1(thisValue, ix,event){
        var list=this.state.monthlyinfo
        list[ix]['comment']=event.target.value
        this.setState({
            thisValue:thisValue,
            [event.target.name]: event.target.value,
            monthlyinfo:list
        });
    }
    handleChange(event) {
        this.setState({
            //sets the value in the input field after change to this.state.search
            [event.target.name]: event.target.value,

            //clears the info state to show the loading icon
            info: []
        });
        //To make call to API with new date.
        //alert(event.target.value)

        if(event.target.value===""){
            this.setState({
                dateDisplayField:"Select a date"
            })
        }
        else{
            var date = event.target.value.split('-');
            var day = parseInt(date[2], 10);
            var final = date[0] + '-' + date[1] + '-' + day.toString();
            this.handleSubmit(final);
        }
    }
    handleMonthChange(event) {
        this.setState({
            //sets the value in the input field after change to this.state.selectedmonth
            [event.target.name]: event.target.value,

            //clears the monthlyinfo state to show the loading icon
            monthlyinfo: []
        });
        console.log(event.target.value)
        if(event.target.value===""){
            this.setState({
                monthDisplayField:"Select a Month"
            })
        }
        else{
            //To make call to API with new month.
            this.monthlyRequestToApi(event.target.value);
        }

    }
    requestToApi(date) {
        this.setState({
            dateDisplayField: "..."
        });
        axios.get(EMPLOYEE_API_URL, {
            headers:{
                token:localStorage.getItem('idToken')
            },
            params: {
                param1: "employeeOverall",
                param2: date,
                param3: localStorage.getItem("employeename")
            }
        })
            .then(response => {
                //console.log(response)
                if (response.data === "Nothing From AWS Lambda Here") {
                    this.setState({
                        displayText: "Wrong credentials"
                    });
                }
                else if (response.data === "Couldnot load data") {
                    this.setState({
                        displayText: "Error in fetching data"
                    });
                }
                else {
                    // console.log(response.data)
                    var rfinal = "{" + response.data + "}";
                    var m = rfinal.replace(/'/g, '"');
                    let final = JSON.parse(m);
                    this.setState({
                        info: final,
                        dateDisplayField: "OverAll Record of "+localStorage.getItem("employeename")+" for "+date
                    });
                    //this.props.changeCounter(parseInt(final['count']), final['leaveid'], final['startdate'], final['leavestatus'], final['enddate'], final['leavetype'], final['leavedescription'], final['employeeusername']);
                }
            })
            .catch(error => {
                console.log(error)

                /*   localStorage.clear();
                   alert('Session Expired! log in again...');
                   this.props.history.push('/login/employee');*/
            });
    }
    monthlyRequestToApi(date){
        let fields = date.split('-');
        let year = fields[0];
        let month = parseInt(fields[1], 10);
        let monthStr = this.getThisMonth(month);
        this.setState({
            thisYear:year,
            thisMonth:(month-1)
        })
        let d = monthStr + " " + year;
        this.setState({
            monthDisplayField: "..."
        });
        var employeename=localStorage.getItem("employeename");

        if(employeename===""){
            alert("Login First")
        }
        else{
            console.log(d)
            axios.get(EMPLOYEE_API_URL, {
                headers:{
                    token:localStorage.getItem('idToken')
                },
                params: {
                    param1: "employeeMonthly",
                    param2: d,
                    param3: employeename
                }
            })
                .then(response => {
                    console.log("after this")
                    console.log(response.data)
                    if (response.data === "Nothing From AWS Lambda Here") {
                        this.setState({
                            displayText: "Wrong credentials"
                        });
                    }
                    else if (response.data === "Couldnot load data") {
                        this.setState({
                            displayText: "Error in fetching data"
                        });
                    }
                    else {
                        //var rfinal = "{" + response.data + "}";
                        //var m = rfinal.replace(/'/g, '"');
                        //console.log(m)
                        let final = JSON.parse(response.data["res"]);
                        let event = response.data["events"]
                        let event_description = response.data["event_description"]
                        console.log(event_description)
                        var eventDate = []
                        for(var i =0;i<event.length;i++){
                            eventDate[i] = event[i].split(" ")[0]
                        }

                        this.setState({
                            event_description:event_description,
                            events:eventDate,
                            RemainingSickLeave:response.data["res1"][0],
                            RemainingAnnualLeave:response.data["res1"][2],
                            RemainingSubstituteLeave:response.data["res1"][1],
                            monthlyinfo: final,
                            monthDisplayField: "Monthly Record of "+employeename+" for "+d
                        });
                    }
                })
                .catch(error => {
                    //localStorage.clear();
                    //alert('Session Expired! log in again...');
                    //this.props.history.push('/login/employee');
                    console.log(error)
                });

        }

    }

    //Function that renders initially when the Table component is created.
    componentDidMount(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        var mon=this.getThisMonth(mm);
        var date=dd.toString()+" "+ mon.toString() + " " +yyyy.toString();
        var toMonth=yyyy.toString()+"-"+mm.toString();
        this.requestToApi(date);
        this.monthlyRequestToApi(toMonth);
        this.setState({
            thisYear:yyyy,
            thisMonth:(mm-1)
        })
    }

    handleSubmit(a){
        var fields = a.split('-');
        var year = fields[0];
        var month = parseInt(fields[1], 10);
        var day = fields[2];
        var monthStr = this.getThisMonth(month);
        var date=day+" "+ monthStr + " " +year;
        this.requestToApi(date)
        // this.monthlyRequestToApi(month)
    }
    handleCommentSubmit(date,event){
        if(event.key === "Enter"){
            var comment =this.state.comment;
            var username = localStorage.getItem("employeename")
            console.log(date);
            axios.get(EMPLOYEE_API_URL, {
                headers:{
                    token:localStorage.getItem('idToken')
                },
                params: {
                    param1: "AddComment",
                    param2: comment,
                    param3: username,
                    param4: date
                }
            })
                .then(response => {
                    console.log(response)
                    if(response.data ==="Successfully added comment"){
                        alert("Successfully added comment")
                        // Location = Location;
                    }
                    else{
                        alert("Something went wrong !!!")
                    }
                })
                .catch(error => {
                    console.log(error)
                });

        }

    }
    handleSubstituteClick(m,event){
        this.setState({
            SubstituteLeaveClicked:true,
            SubstituteDate:m
        })
    }
    handleSubstituteLeave(date,event){
        confirmAlert({
            title: '',
            message: 'Are Your Sure!!!',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmSubstituteLeave(date)
                },
                {
                    label: 'No',
                    onClick: () => ""
                }
            ]
        })
    }
    confirmSubstituteLeave(date){
        console.log(date)
        axios.get(EMPLOYEE_API_URL, {
            headers:{
                token:localStorage.getItem('idToken')
            },
            params: {
                param1: "RequestSubstituteLeave",
                param2: date,
                param3: localStorage.getItem("employeename")
            }
        })
            .then(response => {
                alert(response.data);
            })
            .catch(error => {
                console.log(error)

                /*   localStorage.clear();
                   alert('Session Expired! log in again...');
                   this.props.history.push('/login/employee');*/
            });
    }
    render(){
        console.log(this.state.comment);
        let changeInSearchField = this.handleChange.bind();
        let monthlyClick = this.handleMonthChange.bind();
        //let commentSubmitClick = this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date']);
        // console.log(this.state.monthlyinfo);
        var overallForDate=[];

        // this is put up to help define the length of array
        var dateCount = new Date(this.state.thisYear,(this.state.thisMonth+1),0).getDate();
        // console.log(this.state.thisYear)
        // console.log(this.state.thisMonth)
        // console.log(dateCount)
        var monthlyRecordForEmployee=[];

        if(this.state.info.length===0){
            if(this.state.dateDisplayField==="Select a date"){

            }
            else {
                overallForDate.push(
                    <tr key={0} className="centree">
                        <td>
                            <div className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </td>
                    </tr>
                )
            }
        }
        else{
            overallForDate.push(
                <div>
                    <h5 style={{marginBottom:'unset'}}>Daily For {this.state.info['Date'][0]}</h5>
                    <hr/>
                    <p>Status: {this.state.info['Status'][0]}</p>
                    <p>Entry Time: {this.state.info['Entry'][0]}</p>
                    <p>Exit Time: {this.state.info['Exit'][0]}</p>
                    <h5 style={{marginBottom:'unset'}}>Monthly For {this.state.info['Month'][0]}</h5>
                    <hr/>
                    <p>Working Days: {this.state.info['Working'][0]}</p>
                    <p>Present Days: {this.state.info['Present'][0]}</p>
                    <p>Absent Days: {this.state.info['Absent'][0]}</p>
                    <p>Total Leave: {this.state.info['Leave'][0]}</p>
                    <h5 style={{marginBottom:'unset'}}>Yearly for {this.state.info['Month'][0].split(" ")[1]}</h5>
                    <hr/>

                    <p>Total Remaining Sick Leave: {((this.state.info['Month'][0].split(" ")[1])==='2018')?this.state.RemainingSickLeave:'N/A'}</p>
                    <p>Total Remaining Annual Leave: {((this.state.info['Month'][0].split(" ")[1])==='2018')?this.state.RemainingAnnualLeave:'N/A'}</p>
                    <p>Total Remaining Substitute Leave: {((this.state.info['Month'][0].split(" ")[1])==='2018')?parseInt(this.state.RemainingSubstituteLeave,10):'N/A'}</p>

                </div>
            );
        }
        if(this.state.monthlyinfo.length===0){
            if(this.state.monthDisplayField==="Select a Month"){

            }
            else{
                monthlyRecordForEmployee.push(
                    <tr key={0} className="centree">
                        <td>
                            <div className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </td>
                    </tr>
                );
            }
        }
        else{
            //for sorting
            this.state.monthlyinfo.sort(function (a, b) {
                var day=parseInt(a.Date.split(" "), 10)
                var day2=parseInt(b.Date.split(" "), 10)
                return day-day2
            })

            //to count saturdays

            var firstDay = new Date(this.state.thisYear, this.state.thisMonth, 1);
            var firstSat = 0;
            var saturday = [];
            switch(firstDay.getDay()){
                case 0: firstSat=7; break;
                case 1: firstSat=6; break;
                case 2: firstSat=5; break;
                case 3: firstSat=4; break;
                case 4: firstSat=3; break;
                case 5: firstSat=2; break;
                case 6: firstSat=1; break;
                default:break;
            }
            for(var j =1;j<=dateCount;j++){
                if(j === firstSat){
                    saturday.push(j);
                    firstSat = firstSat+7;
                }
            }

            // console.log(this.state.thisMonth)
            //console.log(this.state.monthlyinfo)
            var presentdayslist=[]
            for(var i=0; i<this.state.monthlyinfo.length; i++){
                var thisdate=this.state.monthlyinfo[i]['Date'];
                var dayin=thisdate.split(" ");
                var dayinNumber=dayin[0]
                // presentdayslist.push(dayinNumber)

                var thisDay = parseInt(dayinNumber,10);
                presentdayslist.push(thisDay)
                // var absent = false;
                // for(var j =0;j<saturday.length;j++){
                //     console.log(thisDay);
                //     if(saturday[j] === thisDay){
                //         absent = true
                //     }
                // }



            }
            // console.log(typeof this.state.events+" "+ this.state.events);

            var  eventss=this.state.events;

            for(var m=1; m<=dateCount; m++){
                var ix=presentdayslist.indexOf(m)

                var entry_time = ''
                var exit_time= ''
                var entrystatus= ''
                var comment = ''
                if(saturday.includes(m)) {

                    try{
                        if(this.state.monthlyinfo[ix]['entry_time'] !== ''){
                            entry_time = this.state.monthlyinfo[ix]['entry_time']
                        }
                        if(this.state.monthlyinfo[ix]['exit_time'] !== ''){
                            exit_time = this.state.monthlyinfo[ix]['exit_time']
                        }
                        if(this.state.monthlyinfo[ix]['entrystatus'] !== ''){
                            entrystatus = this.state.monthlyinfo[ix]['entrystatus']
                        }
                        if(this.state.monthlyinfo[ix]['employeecomment'] !== ''){
                            comment = this.state.monthlyinfo[ix]['employeecomment']
                        }

                    }catch(err){

                    }
                    if(this.state.SubstituteDate === m && this.state.SubstituteLeaveClicked){
                        var date = m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                                <td style={{color: "#43beff"}}>Saturday</td>
                                <td>{entry_time}</td>
                                <td>{exit_time}</td>
                                <td>{entrystatus}</td>
                                <td>
                                    <button onClick={this.handleSubstituteLeave.bind(this,date)}>Substitute Leave</button>
                                </td>
                            </tr>
                        )
                    }
                    else{
                        monthlyRecordForEmployee.splice(m-1, 0,

                            <tr style={{cursor:'pointer'}}onClick={this.handleSubstituteClick.bind(this,m)} key={m}>
                                <td>{m}</td>
                                <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                                <td style={{color: "#27ddff"}}>Saturday</td>
                                <td>{entry_time}</td>
                                <td>{exit_time}</td>
                                <td>{entrystatus}</td>
                                <td>
                                    {comment}
                                </td>
                            </tr>
                        )
                    }


                }
                else if(eventss.includes(m.toString())){
                    try{
                        if(this.state.monthlyinfo[ix]['entry_time'] !== ''){
                            entry_time = this.state.monthlyinfo[ix]['entry_time']
                        }
                        if(this.state.monthlyinfo[ix]['exit_time'] !== ''){
                            exit_time = this.state.monthlyinfo[ix]['exit_time']
                        }
                        if(this.state.monthlyinfo[ix]['entrystatus'] !== ''){
                            entrystatus = this.state.monthlyinfo[ix]['entrystatus']
                        }

                    }catch(err){

                    }
                    if(this.state.SubstituteDate === m && this.state.SubstituteLeaveClicked){
                        var date1 = m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                                <td style={{color: "#ffc61d"}}>Holiday</td>
                                <td>{entry_time}</td>
                                <td>{exit_time}</td>
                                <td>{entrystatus}</td>
                                <td>
                                    <button onClick={this.handleSubstituteLeave.bind(this,date1)}>Substitute Leave</button>
                                </td>
                            </tr>
                        )
                    }
                    else{
                        monthlyRecordForEmployee.splice(m-1, 0,

                            <tr style={{cursor:'pointer'}}onClick={this.handleSubstituteClick.bind(this,m)} key={m}>
                                <td>{m}</td>
                                <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                                <td style={{color: "#ffc61d"}}>Holiday</td>
                                <td>{entry_time}</td>
                                <td>{exit_time}</td>
                                <td>{entrystatus}</td>
                                <td>
                                    {comment}
                                </td>
                            </tr>
                        )
                    }
                }

                else if(presentdayslist.includes(m)){

                    // console.log(this.state.monthlyinfo[ix]['Date'])
                    // let thisdate=this.state.monthlyinfo[ix]['Date']
                    if(this.state.monthlyinfo[ix]['leavestatus']==="true") {

                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{this.state.monthlyinfo[ix]['Date']}</td>
                                <td style={{color: "#ffb976"}}>OnLeave</td>
                                <td>{this.state.monthlyinfo[ix]['entry_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['exit_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['entrystatus']}</td>
                                <td>
                                    <div className="comment-div">
                                        {/*<form onSubmit={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])} action="">*/}
                                        <form action="">
                                            <textarea
                                                className="textarea_employee"
                                                id="comment"
                                                name="comment"
                                                // eslint-disable-next-line no-use-before-define
                                                onKeyPress={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}
                                                onChange={this.handleChange1.bind(this,m,ix)}
                                                defaultValue={this.state.monthlyinfo[ix]['employeecomment']}
                                                placeholder="Add Your comment here"
                                                rows="3"
                                                cols="15"/>
                                            {/*{((this.state.comment) == '')?*/}
                                            {/*'' :*/}
                                            {/*<button className="comment-button" onClick={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}>comment</button>*/}
                                            {/*}*/}
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    else if(this.state.monthlyinfo[ix]['leavestatus'] ==="HalfDayLeave"){
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{this.state.monthlyinfo[ix]['Date']}</td>
                                <td style={{color: "#00FF00"}}>Present/HDL</td>
                                <td>{this.state.monthlyinfo[ix]['entry_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['exit_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['entrystatus']}</td>
                                <td>
                                    <div className="comment-div">
                                            <textarea
                                                className="textarea_employee"
                                                id="comment"
                                                name="comment"
                                                onKeyPress={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}
                                                onChange={this.handleChange1.bind(this,m,ix)}
                                                defaultValue={this.state.monthlyinfo[ix]['employeecomment']}
                                                placeholder="Add Your comment here"
                                                rows="3"
                                                cols="15"/>
                                        {/*{((this.state.comment) == '')?*/}
                                        {/*'' :*/}
                                        {/*<button className="comment-button" onClick={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}>comment</button>*/}
                                        {/*}*/}


                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    else{
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{this.state.monthlyinfo[ix]['Date']}</td>
                                <td style={{color: "#00FF00"}}>Present</td>
                                <td>{this.state.monthlyinfo[ix]['entry_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['exit_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['entrystatus']}</td>
                                <td>
                                    <div className="comment-div">
                                            <textarea
                                                className="textarea_employee"
                                                id="comment"
                                                name="comment"
                                                onKeyPress={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}
                                                onChange={this.handleChange1.bind(this,m,ix)}
                                                defaultValue={this.state.monthlyinfo[ix]['employeecomment']}
                                                placeholder="Add Your comment here"
                                                rows="3"
                                                cols="15"/>
                                        {/*{((this.state.comment) == '')?*/}
                                        {/*'' :*/}
                                        {/*<button className="comment-button" onClick={this.handleCommentSubmit.bind(this,this.state.monthlyinfo[ix]['Date'])}>comment</button>*/}
                                        {/*}*/}


                                    </div>
                                </td>
                            </tr>
                        )
                    }
                }


                else{
                    monthlyRecordForEmployee.splice(m-1, 0,
                        <tr key={m}>
                            <td>{m}</td>
                            <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                            <td style={{color: "#ff0000"}}>Absent</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    )
                }
            }
            // console.log(monthlyRecordForEmployee)

            /*for(var i=0; i<this.state.monthlyinfo['date']
            .length; i++){
                var thisdate=this.state.monthlyinfo['date'][i];
                var dayin=thisdate.split(" ");
                var dayinNumber=dayin[0]
                if(this.state.monthlyinfo['status'][i]==="Present") {
                    monthlyRecordForEmployee.push(
                        <tr key={dayinNumber}>
                            <td>{dayinNumber}</td>
                            <td>{this.state.monthlyinfo['date'][i]}</td>
                            <td style={{color: "#00FF00"}}>{this.state.monthlyinfo['status'][i]}</td>
                            <td>{this.state.monthlyinfo['entry'][i]}</td>
                            <td>{this.state.monthlyinfo['exit'][i]}</td>
                        </tr>
                    )
                }
                else{
                    monthlyRecordForEmployee.push(
                        <tr key={dayinNumber}>
                            <td>{dayinNumber}</td>
                            <td>{this.state.monthlyinfo['date'][i]}</td>
                            <td style={{color: "#0000FF"}}>{this.state.monthlyinfo['status'][i]}</td>
                            <td>{this.state.monthlyinfo['entry'][i]}</td>
                            <td>{this.state.monthlyinfo['exit'][i]}</td>
                        </tr>
                    )
                }

            }*/

        }

        return (
            <section id="about" className="masthead text-center">
                <div className="intro-body text-center">
                    <div className="container">
                        <div className="mx-auto">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="col-md-8 manoj">
                                        <p>Search by Date</p>
                                        <input
                                            className="form-control padded"
                                            type="date"
                                            name="search"
                                            id="search"
                                            value={this.state.search}
                                            onChange={changeInSearchField}
                                            placeholder="Search"
                                        />
                                    </div>
                                    <div className="panel panel-primary">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Overall Records</h3>
                                        </div>
                                        <div className="panel-body fixed-height">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    {overallForDate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>{this.state.dateDisplayField}</p>

                                </div>
                                <div className="col-md-8">
                                    <div className="col-md-5 manoj">
                                        <p>Search by Month</p>
                                        <input
                                            className="form-control"
                                            type="month"
                                            name="searchmonth"
                                            id="searchmonth"
                                            value={this.state.searchmonth}
                                            onChange={monthlyClick}
                                            placeholder="SearchMonth"
                                        />
                                    </div>
                                    <div className="panel panel-monthly">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Monthly Records</h3>
                                        </div>
                                        <div className="panel-body fixed-height">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th>Id</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Entry Time</th>
                                                            <th>Exit Time</th>
                                                            <th>EntryStatus</th>
                                                            <th>Comment</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {monthlyRecordForEmployee}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>{this.state.monthDisplayField}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

/*
function mapStateToProps(state){
    return {
        employee:state.employee
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({

    })
}

export default connect(mapStateToProps, matchDispatchToProps)(EmployeeTable);*/
export default withRouter(EmployeeTable);