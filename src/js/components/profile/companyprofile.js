import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios/index";
import NavBar from '../navbar/adminloggedinnavbar'
import {COMPANY_API_URL} from "../../../config";
import '../../../HomeTemplate/vendor/bootstrap/css/bootstrap.min.css';
import '../../../HomeTemplate/vendor/font-awesome/css/font-awesome.min.css';
import '../../../HomeTemplate/css/grayscale.min.css';
import '../../../css/custom.css';
import '../../../css/loader.css'
import {animateScroll as scroll} from 'react-scroll'

class CompanyProfile extends Component{
    constructor(props){
        super(props);
        var today = new Date();
        var mm = today.getMonth() + 1;
        var m = mm.toString();
        if (mm < 10) {
            m = "0" + mm.toString();
        }
        var yyyy = today.getFullYear();
        var monthForSearch = yyyy.toString() + '-' + m.toString();
        this.state= {
            fromapi1:[],
            // fromapi1:localStorage.getItem('employeenotification'),
            fromapi:[],
            info: '',
            apiInfo: [],
            selecteduser:'',
            employeedetails:false,
            active:-1,
            searchmonth: monthForSearch,
            monthlyinfo:[],
            monthDisplayField:'',

            selecteditem1:{},
            notificationdetails:false,
            thisYear:0,
            thisMonth:0,

            RemainingSickLeave:0,
            RemainingAnnualLeave:0,
            RemainingSubstituteLeave:0,

            events:[]

        };
        // this.handleChange = this.handleChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.monthlyRequestToApi = this.monthlyRequestToApi.bind(this);
        this.handleClickDetails= this.handleClickDetails.bind(this);
        // this.handleValueUpdate = this.handleValueUpdate.bind(this);
        // this.handleClick= this.handleClick.bind(this);
    }
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
    componentDidMount(){


        axios.get(COMPANY_API_URL, {
            headers:{
                token: localStorage.getItem('companyIdToken')
            },
            params : {
                param1: "CompanyProfile",
                param2: localStorage.getItem("adminname")
            }
        })
            .then(response => {
                var rfinal = "{" + response.data + "}";
                var m = rfinal.replace(/'/g, '"');
                //var ma=m.replace(/\\/g, '"');
                // console.log(rfinal)
                var final = JSON.parse(m);
                // console.log(final)
                this.setState({
                    apiInfo:final
                });

            })
            .catch(error => {
                console.log(error)
                // if(error['message']==="Network Error") {
                //     localStorage.clear()
                //     // alert("Your session has expired! Log in again...")
                //     this.props.history.push('/login/company')
                // }
            });

    }
    handleClick(i,username,e){
        // this.handleValueUpdate;
        scroll.scrollTo(590);

        localStorage.setItem("employeeusername",username)
        this.setState({
            selecteduser:username,
            employeedetails: true,
            notificationdetails:false,
            active: i
        })

        // alert(this.state.selecteduser)
        var today = new Date();
        // var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        // var mon=this.getThisMonth(mm);
        // var date=dd.toString()+" "+ mon.toString() + " " +yyyy.toString();
        var toMonth=yyyy.toString()+"-"+mm.toString();
        // this.requestToApi(date);
        this.monthlyRequestToApi(toMonth);

        // console.log(localStorage.getItem('employeeusername'))
        // this is  for notification part
        // console.log(this.state.apiInfo["employeeusername"][i])
        axios.get(COMPANY_API_URL, {
            headers:{
                token:localStorage.getItem('companyIdToken')
            },
            params:{
                param1: "checkForEmpNotification",
                param2: username
            }
        })
            .then(response =>{

                // console.log(response.data)
                let data=JSON.parse(response.data);
                // var data1 = JSON.stringify(data[1]);
                // console.log(typeof data)

                // localStorage.setItem('notification', JSON.stringify(data[0]))
                localStorage.setItem('employeenotification', JSON.stringify(data[1]))
                this.setState({
                    fromapi: data[1],
                    fromapi1:data[1]
                })
            })



    }
    handleMonthChange(event) {

        this.setState({
            //sets the value in the input field after change to this.state.selectedmonth
            [event.target.name]: event.target.value,

            //clears the monthlyinfo state to show the loading icon
            monthlyinfo: []
        });

        if(event.target.value===""){
            this.setState({
                monthDisplayField:"Select a Month"
            })
            // alert("we are at here")
        }
        else{

            // console.log(event.target.value);
            // alert("we are at here")
            //To makeWorkingDays:0, call to API with new month.
            this.monthlyRequestToApi(event.target.value);
        }

    }

    monthlyRequestToApi(date){

        // console.log("selected user is "+this.state.selecteduser)
        let fields = date.split('-');
        let year = fields[0];
        let month = parseInt(fields[1], 10);
        let monthStr = this.getThisMonth(month);
        this.setState({
        	thisYear:year,
        	thisMonth:(month-1)
        })

        let d = monthStr + " " + year;
        // console.log(d);
        this.setState({
            monthDisplayField: "..."
        });
        var employeename=localStorage.getItem("employeeusername");
        if(employeename===""){
            alert("Login First")
        }
        else{

            console.log(d)
            console.log(employeename)
            axios.get(COMPANY_API_URL, {
                headers:{
                    token: localStorage.getItem('companyIdToken')
                },
                params: {
                    param1: "employeeMonthly",
                    param2: d,
                    param3: employeename
                }
            })
                .then(response => {

                    console.log(response)
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
                        console.log("we are at response.data")
                        // console.log(response.data)

                        //var rfinal = "{" + response.data + "}";
                        //var m = rfinal.replace(/'/g, '"');
                        //console.log(m)
                        let final = JSON.parse(response.data["res"]);
                        let events = response.data["events"];
                        var eventDate = []
                        for(var i =0;i<events.length;i++){
                            eventDate[i] = events[i].split(" ")[0]
                        }

                        console.log(response.data["events"])
                        this.setState({
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
    handleClickDetails(i, e){
        // console.log(this.state.fromapi);
        // let data=JSON.parse(this.state.fromapi1)
        this.setState({
            selecteditem1:this.state.fromapi[i],
            notificationdetails: true,
            // active: i
        })
    }
    render() {
        // console.log(this.state.selecteduser)
        var dateCount = new Date(this.state.thisYear,(this.state.thisMonth+1),0).getDate();
        let tablerows = []
        if(this.state.employeedetails){
            let statusnotifications = this.state.fromapi;
            if (statusnotifications !== "[]") {
                let data = statusnotifications
                // console.log(data["date"].split(""),10);
                data.sort(function (a, b) {
                    var day=new Date(a.date)
                    var day2=new Date(b.date)
                    return day-day2
                })
                // console.log(statusnotifications[1]);
                // console.log(typeof JSON.parse(data));
                for (var j = 0; j < data.length; j++) {
                    let indx1 = j;
                    let notificationclick = this.handleClickDetails.bind(this, indx1);
                    if (j === this.state.active) {
                        tablerows.push(
                            <tr key={j} onClick={notificationclick} className="notificationtable selectedrow">
                                <td>{j + 1}</td>
                                <td>{data[j]['date']}</td>
                                <td>{data[j]['daysnumber']}</td>
                                <td>{data[j]['leavetype']}</td>
                                <td>{data[j]['requeststatus']}</td>
                            </tr>
                        );
                    }
                    else {
                        tablerows.push(
                            <tr key={j} onClick={notificationclick} className="notificationtable">
                                <td>{j + 1}</td>
                                <td>{data[j]['date']}</td>
                                <td>{data[j]['daysnumber']}</td>
                                <td>{data[j]['leavetype']}</td>
                                <td>{data[j]['requeststatus']}</td>
                            </tr>
                        );
                    }
                }
            }
            else {
                tablerows.push(
                    <tr key={0}>
                        <td style={{textAlign: "center"}}>No any requests</td>
                    </tr>
                )

            }

        }

        let monthlyClick = this.handleMonthChange.bind();
        var monthlyRecordForEmployee=[];
        var employeedetails = [];
        if (this.state.apiInfo.length === 0) {
            employeedetails.push(
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
        else {
            // var companyusername = this.state.apiInfo['companyusername'][0];
            // var companyemail = this.state.apiInfo['companyemail'][0];
            // var companyfullname = this.state.apiInfo['companyfullname'][0];
            for (var b = 0; b < this.state.apiInfo['employeeusername'].length; b++) {
                var usernname = this.state.apiInfo['employeeusername'][b];
                var email = this.state.apiInfo['employeeemail'][b];
                var fullname = this.state.apiInfo['employeefullname'][b];
                var position = this.state.apiInfo['employeeposition'][b];
                var department = this.state.apiInfo['employeedepartment'][b];

                employeedetails.push(
                    <tr style={(this.state.active === b)?{color:'#123456'}:{cursor:'pointer'}} onClick={this.handleClick.bind(this, b,usernname)} className='col-md-12' key={b}>
                        <td>{b + 1}</td>
                        <td><a>{usernname}</a></td>
                        <td>{fullname}</td>
                        <td>{email}</td>
                        <td>{position}</td>
                        <td>{department}</td>
                    </tr>
                );
            }
        }

        var LeaveCount =0;
        var PresentCount =0;
        var SaturdayCount =0;
        var AbsentCount = 0;
        var HolidayCount = 0;

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
             console.log(this.state.monthlyinfo["Date"]);
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
            for(var k =1;k<=dateCount;k++){
                if(k === firstSat){
                    saturday.push(k);
                    firstSat = firstSat+7;
                }
            }

            // console.log(this.state.thisMonth)
            //console.log(this.state.monthlyinfo)
            var presentdayslist=[]
            for(var i=0; i<this.state.monthlyinfo.length; i++){
                var thisdate1=this.state.monthlyinfo[i]['Date'];
                var dayin=thisdate1.split(" ");
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


            for(var m=1; m<=dateCount; m++){
                if(presentdayslist.includes(m)){
                    var ix=presentdayslist.indexOf(m)
                    // console.log(this.state.monthlyinfo[ix]['Date'])
                    // var thisdate=this.state.monthlyinfo[ix]['Date']
                    if(this.state.monthlyinfo[ix]['leave']) {
                        LeaveCount = LeaveCount+1;
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{this.state.monthlyinfo[ix]['Date']}</td>
                                <td style={{color: "#ffb976"}}>OnLeave</td>
                                <td>{this.state.monthlyinfo[ix]['entry_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['exit_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['entrystatus']}</td>
                                <td>
                                    {(this.state.monthlyinfo[ix]['employeecomment']) !==""?
                                        <textarea  style={{color:'white'}}
                                            id="comment"
                                            className="textarea"
                                            name="comment"
                                            // onChange={(event) => this.handleChange1(event,m,ix)}
                                            // value=" this this htisht ishtsihtis htsi htsih sith sith this"
                                            value={this.state.monthlyinfo[ix]['employeecomment']}
                                            // placeholder="Add Your comment here"
                                            rows="3"
                                            cols="12"
                                            disabled
                                        />
                                        :""
                                    }

                                </td>
                            </tr>
                        )
                    }
                    else{
                        PresentCount = PresentCount+1
                        monthlyRecordForEmployee.splice(m-1, 0,
                            <tr key={m}>
                                <td>{m}</td>
                                <td>{this.state.monthlyinfo[ix]['Date']}</td>
                                <td style={{color: "#00FF00"}}>Present</td>
                                <td>{this.state.monthlyinfo[ix]['entry_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['exit_time']}</td>
                                <td>{this.state.monthlyinfo[ix]['entrystatus']}</td>
                                 <td>

                                     {(this.state.monthlyinfo[ix]['employeecomment']) !==" "?
                                     <textarea style={{color:'white'}}
                                         id="comment"
                                         className="textarea"
                                         name="comment"
                                         // onChange={(event) => this.handleChange1(event,m,ix)}
                                         // value=" this this htisht ishtsihtis htsi htsih sith sith this"
                                         value={this.state.monthlyinfo[ix]['employeecomment']}
                                         // placeholder="Add Your comment here"
                                         rows="3"
                                         cols="12"
                                        disabled
                                     />
                                     :""
                                 }

                                 </td>
                            </tr>
                        )
                    }

                }
                else if(this.state.events.includes(m.toString())){
                    HolidayCount = HolidayCount+1
                    monthlyRecordForEmployee.splice(m-1, 0,
                        <tr key={m}>
                            <td>{m}</td>
                            <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                            <td style={{color: "#ff171c"}}>Holiday</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                {/**/}
                            </td>
                        </tr>
                    )
                }
                else if(saturday.includes(m)) {
                    SaturdayCount = SaturdayCount+1
                    monthlyRecordForEmployee.splice(m-1, 0,
                        <tr key={m}>
                            <td>{m}</td>
                            <td>{m.toString()+" "+ this.getThisMonth((this.state.thisMonth+1)) +" "+ this.state.thisYear.toString()}</td>
                            <td style={{color: "#e605ff"}}>Saturday</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                {/**/}
                            </td>
                        </tr>
                    )

                }
                else{
                    AbsentCount = AbsentCount+1
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

            // this.handleValueUpdate.bind(AbsentCount,PresentCount,LeaveCount);
                 localStorage.setItem("AbsentCount",AbsentCount);
                 localStorage.setItem("PresentCount",PresentCount);
                 localStorage.setItem("LeaveCount",LeaveCount);
                 localStorage.setItem("HolidayCount",HolidayCount);


        }


        if (this.state.employeedetails) {
            if(this.state.notificationdetails){
                console.log("leave clicked");
                return (
                    <div>
                        <NavBar/>
                        <section id="about" className="masthead text-center">
                            <div className="intro-body text-center">
                                <div className="container">
                                    <div className="col-md-12">
                                        <div className="col-md-12">
                                            <div className="panel panel-primary">
                                                <div className="panel-heading">
                                                    <h3 className="panel-title">Employees List</h3>
                                                </div>
                                                <div className="panel-body fixed-height">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <table className="table">
                                                                <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>UserName</th>
                                                                    <th>FullName</th>
                                                                    <th>Email</th>
                                                                    <th>Position</th>
                                                                    <th>Department</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {employeedetails}
                                                                </tbody>

                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br/>
                                        <hr/>
                                        <h4>Selected Employee: {this.state.apiInfo["employeefullname"][this.state.active]}</h4>
                                        <hr/>
                                        {/*added new by deependra*/}
                                        <div style={{float:'left',marginLeft:'-111px'}}  className="col-md-8">
                                            <div className="col-md-6 manoj">
                                                <h5>Search by Month</h5>
                                                <input
                                                    className="form-control"
                                                    type="month"
                                                    name="searchmonth"
                                                    id="searchmonth"
                                                    value={this.state.searchmonth}
                                                    onChange={monthlyClick}
                                                    placeholder="SearchMonth"
                                                    width="300"
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
                                        {/*added by deependra*/}
                                        <br/><br/><br/><br/><br/>
                                        <div style={{float:'left'}}  className="col-md-5">
                                            <h5><u>{this.getThisMonth(this.state.thisMonth+1)}'s Profile of {this.state.selecteduser}</u></h5>
                                            <h6>Total Working Days: {parseInt(localStorage.getItem("PresentCount"),10)+parseInt(localStorage.getItem("AbsentCount"),10)+parseInt(localStorage.getItem("LeaveCount"),10)-parseInt(localStorage.getItem("HolidayCount"),10)}</h6>
                                            <h6>Total Present Days: {localStorage.getItem("PresentCount")}</h6>
                                            <h6>Total Absent Days: {localStorage.getItem("AbsentCount")}</h6>
                                            <h6>Total Leaves: {localStorage.getItem("LeaveCount")}</h6>

                                            <h5><u>Annual Profile of {this.state.selecteduser}</u></h5>
                                            <h6>Remaining Sick Leave this year: {this.state.RemainingSickLeave}</h6>
                                            <h6>Remaining Annual Leave this year: {this.state.RemainingAnnualLeave}</h6>
                                            <h6>Remaining Substitute Leave this year: {this.state.RemainingSubstituteLeave}</h6>

                                        </div>

                                    </div>

                                    {/*add this here*/}


                                </div>

                            </div>

                        </section>
                        <div style={{float:'left'}} className="col-md-6">
                            <div className="panel panel-monthly">
                                <div className="panel-heading">
                                    <h3 align="center" className="panel-title">Leave Requests</h3>
                                </div>
                                <div className="panel-body fixed-height">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table notificationtable">
                                                <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Start Date</th>
                                                    <th>DaysNo</th>
                                                    <th>LeaveType</th>
                                                    <th>Request Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {tablerows}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{float:'left'}} className="col-md-6">
                            <br/>
                            <div className="request-panel">
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td>Manager Username</td>
                                        <td>{this.state.selecteditem1['managerusername']}</td>
                                    </tr>
                                    <tr>
                                        <td>Leave Start Date</td>
                                        <td>{this.state.selecteditem1['date']}</td>
                                    </tr>
                                    <tr>
                                        <td>Leave End Date</td>
                                        <td>{this.state.selecteditem1['enddate']}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Requested Days</td>
                                        <td>{this.state.selecteditem1['daysnumber']}</td>
                                    </tr>
                                    <tr>
                                        <td>Leave Type</td>
                                        <td>{this.state.selecteditem1['leavetype']}</td>
                                    </tr>
                                    <tr>
                                        <td>Leave Description</td>
                                        <td>{this.state.selecteditem1['leavedescription']}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Status</td>
                                        <td>{this.state.selecteditem1['requeststatus']}</td>
                                    </tr>
                                    <tr>
                                        <td>Manager Comments</td>
                                        <td>{this.state.selecteditem1['managercomment']}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                );
            }
            else{
                console.log("employee clicked");
                return (
                    <div>
                        <NavBar/>
                        <section id="about" className="masthead text-center">
                            <div className="intro-body text-center">
                                <div className="container">
                                    <div className="col-md-12">
                                        <div className="col-md-12">
                                            <div className="panel panel-primary">
                                                <div className="panel-heading">
                                                    <h3 className="panel-title">Employees List</h3>
                                                </div>
                                                <div className="panel-body fixed-height">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <table className="table">
                                                                <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>UserName</th>
                                                                    <th>FullName</th>
                                                                    <th>Email</th>
                                                                    <th>Position</th>
                                                                    <th>Department</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {employeedetails}
                                                                </tbody>

                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br/>
                                        <hr/>
                                        <h4>Selected Employee: {this.state.apiInfo["employeefullname"][this.state.active]}</h4>
                                        <hr/>
                                        {/*added new by deependra*/}
                                        <div style={{float:'left',marginLeft:'-111px'}}  className="col-md-8">
                                            <div className="col-md-6 manoj">
                                                <h5>Search by Month</h5>
                                                <input
                                                    className="form-control"
                                                    type="month"
                                                    name="searchmonth"
                                                    id="searchmonth"
                                                    value={this.state.searchmonth}
                                                    onChange={monthlyClick}
                                                    placeholder="SearchMonth"
                                                    width="300"
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

                                        {/*added by deependra*/}
                                        <br/><br/><br/><br/><br/>

                                        <div style={{float:'left'}}  className="col-md-5">
                                            <h5><u>{this.getThisMonth(this.state.thisMonth+1)}'s Profile of {this.state.selecteduser}</u></h5>
                                            <h6>Total Working Days: {parseInt(localStorage.getItem("PresentCount"),10)+parseInt(localStorage.getItem("AbsentCount"),10)+parseInt(localStorage.getItem("LeaveCount"),10)}</h6>
                                            <h6>Total Present Days: {localStorage.getItem("PresentCount")}</h6>
                                            <h6>Total Absent Days: {localStorage.getItem("AbsentCount")}</h6>
                                            <h6>Total Leaves: {localStorage.getItem("LeaveCount")}</h6>

                                            <h5><u>Annual Profile of {this.state.selecteduser}</u></h5>
                                            <h6>Remaining Sick Leave this year: {this.state.RemainingSickLeave}</h6>
                                            <h6>Remaining Annual Leave this year: {this.state.RemainingAnnualLeave}</h6>
                                            <h6>Remaining Substitute Leave this year: {this.state.RemainingSubstituteLeave}</h6>
                                        </div>

                                    </div>

                                    {/*add this here*/}


                                </div>

                            </div>

                        </section>
                        <div className="col-md-6">
                            <div className="panel panel-monthly">
                                <div className="panel-heading">
                                    <h3 align="center" className="panel-title">Leave Requests</h3>
                                </div>
                                <div className="panel-body fixed-height">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table notificationtable">
                                                <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Start Date</th>
                                                    <th>DaysNo</th>
                                                    <th>LeaveType</th>
                                                    <th>Request Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {tablerows}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                );
            }
        }
        else {
            console.log("nothing clicked");
            return (
                <div>
                    <NavBar/>
                    <section id="about" className="masthead text-center">
                        <div className="intro-body text-center">
                            <div className="container">
                                <div className="col-md-12">
                                    <div className="row">
                                    </div>
                                    <div className="col-md-12">
                                        <div className="panel panel-primary">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">Employees List</h3>
                                            </div>
                                            <div className="panel-body fixed-height">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <table className="table">
                                                            <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>UserName</th>
                                                                <th>FullName</th>
                                                                <th>Email</th>
                                                                <th>Position</th>
                                                                <th>Department</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {employeedetails}
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            );
        }
    }


}
export default withRouter(CompanyProfile)