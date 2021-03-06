import React, {Component} from "react";
import axios from "axios/index";
import NavBar from './navbar/employeeloggedinnavbar';
import {EMPLOYEE_API_URL} from '../../config';
import {notificationscheck} from "../helpers";
import '../../css/loadergif.css'


class AddRequest extends Component{
    constructor(props){
        super(props);
        this.state={
            addRequest:false,

            fromapi:localStorage.getItem('requeststatus'),
            selecteditem:{},
            details:false,
            active:null,


            startdate:this.today(),
            enddate:this.today(),
            leavetype:'Sick Leave',
            otherleavetype:'Maternity',
            halfdayleave:'Half Day Leave-Sick Leave',

            leavedescription:'',
            info:'',
            loaderCSS:"none"

        };
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleClick=this.handleClick.bind(this)
        this.changeView=this.changeView.bind(this)
    }
    today(){
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
        return dateForSearch
    }
    changeView(event){
        event.preventDefault();
        if (this.state.addRequest) {
            this.setState({
                addRequest: false
            })
        }
        else{
            this.setState({
                addRequest: true
            })
        }
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
    dateToApi(date){
        var startfields = date.split('-');
        var startyear = startfields[0];
        var startmonth = parseInt(startfields[1], 10);
        var startday = parseInt(startfields[2], 10);
        var startmonthstr = this.getThisMonth(startmonth);
        var startdate=startday.toString()+" "+ startmonthstr + " " +startyear;
        return startdate;
    }
    handleSubmit(event){
        event.preventDefault()
        var startdate=new Date(this.state.startdate);
        var enddate=new Date(this.state.enddate);
        if(enddate.getTime() >= startdate.getTime()){
            this.setState({
                info:"Please Wait...",
                loaderCSS:"block"
            });
            var timeDiff=Math.abs(enddate.getTime()-startdate.getTime());
            var diffDays=Math.ceil(timeDiff / (1000*3600*24))+1
            var count=0
            var d1=startdate;
            for(var i=0;i<diffDays;i++){
                var day=d1.getDay();
                if (day === 6){
                    count=count+1;
                }
                d1.setDate(d1.getDate()+1)
            }

            diffDays=diffDays-count


            //determine if it is other leave or not
            var leaveType = '';
            if(this.state.leavetype ==="Any Other")
            {
                leaveType = this.state.otherleavetype
            }
            else if(this.state.leavetype === "Half Day Leave"){
                leaveType = this.state.halfdayleave;
                diffDays = 0.5
            }
            else{
                leaveType = this.state.leavetype
            }
            alert(diffDays)
            var diff = parseFloat(diffDays);
            console.log(localStorage.getItem("employeename"))
            console.log(this.dateToApi(this.state.startdate))
            console.log(this.dateToApi(this.state.enddate))
            console.log(leaveType)
            console.log(this.state.leavedescription)
            console.log(typeof diff)
            axios.get(EMPLOYEE_API_URL,{
                headers:{
                    token:localStorage.getItem("idToken")
                },
                params:{
                    param1:"AddRequest",
                    param2:localStorage.getItem("employeename"),
                    param3: this.dateToApi(this.state.startdate),
                    param4: this.dateToApi(this.state.enddate),
                    param5:leaveType,
                    param6:this.state.leavedescription,
                    param7: diff
                }
            })
                .then(response=>{
                    console.log("this is begin")
                    console.log(response.data)
                    console.log("this is end")
                    if(response.data ==="Not enough provision"){
                        this.setState({
                            info:"Not enough Leave Request remaining. Please apply for leave without pay.",
                            loaderCSS:"none"
                        })
                    }
                    else{
                        notificationscheck();
                        // console.log(response.data)
                        this.setState({
                            info:"Successfully Requested!",
                            loaderCSS:"none"
                        });
                        setTimeout(()=>{
                            // window.location.reload(true)
                            /*this.setState({
                                startdate:this.today(),
                                enddate:this.today(),
                                leavetype:'Sick Leave',
                                leavedescription:'',
                                info:'',
                                addRequest:false
                            })*/
                        }, 3000)
                    }


                })
                .catch(error => {
                    //localStorage.setItem("employee", "");
                    //localStorage.setItem("admin", "");
                    //localStorage.setItem("employeename", "");
                    //localStorage.setItem("adminname", "");

                    localStorage.clear();
                    alert("Your Session Expired! Log in again.")
                    this.props.history.push('/login/employee');

                });
        }
        else{
            this.setState({
                info: "Date selection Error",
                loaderCSS:"none"
            })
        }


    }
    handleClick(i, e){
        let data=JSON.parse(this.state.fromapi)
        this.setState({
            selecteditem:data[i],
            details: true,
            active: i
        })
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }
    render(){

        let statusnotifications=this.state.fromapi;
        let tablerows=[]
        if(statusnotifications!=="[]"){
            let data = JSON.parse(statusnotifications)
            console.log(typeof data)
            for (var j=0; j< data.length ; j++) {
                let indx1 = j;
                let notificationclick = this.handleClick.bind(this, indx1);
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
        else{
            tablerows.push(
                <tr key={0}><td style={{textAlign:"center"}}>No any requests</td></tr>
            )

        }
        if(this.state.addRequest) {
            return (
                <div>
                    <NavBar data={"employee"}/>
                    <header className="masthead">
                        <div className="intro-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 mx-auto">
                                        <h3>Add Request</h3>
                                        <form onSubmit={this.handleSubmit} className="form-custom">
                                            <div>
                                                <label>Start Date</label><br/>
                                                <input
                                                    type="date"
                                                    name="startdate"
                                                    id="startdate"
                                                    value={this.state.startdate}
                                                    onChange={(event) => this.handleChange(event)}
                                                    placeholder="Start Date"
                                                /><br/>
                                            </div>
                                            <div>
                                                <label>End Date</label><br/>
                                                <input
                                                    type="date"
                                                    name="enddate"
                                                    id="enddate"
                                                    value={this.state.enddate}
                                                    onChange={(event) => this.handleChange(event)}
                                                    placeholder="Start Date"
                                                /><br/>
                                            </div>
                                            <div>
                                                <label>Leave Type</label><br/>
                                                <select
                                                    id="leavetype"
                                                    name="leavetype"
                                                    value={this.state.leavetype}
                                                    onChange={(event) => this.handleChange(event)}
                                                >
                                                    <option value="Sick Leave">Sick Leave</option>
                                                    <option value="Annual Leave">Annual Leave</option>
                                                    <option value="Substitute Leave">Substitute Leave</option>
                                                    <option value="Half Day Leave">Half Day Leave</option>
                                                    <option value="Work From Home">Work From Home</option>
                                                    <option value="Leave Without Pay">Leave Without Pay</option>
                                                    <option value="Any Other">Any Other</option>
                                                </select><br/>
                                                {((this.state.leavetype) ==="Any Other")?
                                                    <select
                                                        id="otherleavetype"
                                                        name="otherleavetype"
                                                        value={this.state.otherleavetype}
                                                        onChange={(event) => this.handleChange(event)}
                                                    >
                                                        <option value="Paternity">Paternity(Male staff only)</option>
                                                        <option value="Maternity">Maternity(Female staff only)</option>
                                                        <option value="Mourning">Mourning</option>

                                                    </select>:""
                                                }
                                                {((this.state.leavetype) ==="Half Day Leave")?
                                                    <select
                                                        id="halfdayleave"
                                                        name="halfdayleave"
                                                        value={this.state.halfdayleave}
                                                        onChange={(event) => this.handleChange(event)}
                                                    >
                                                        <option value="Half Day Leave-Sick Leave">Deduct from Sick</option>
                                                        <option value="Half Day Leave-Annual Leave">Deduct from Annual</option>

                                                    </select>:""
                                                }

                                            </div>
                                            <div>
                                        <textarea
                                            name="leavedescription"
                                            type="text"
                                            placeholder="Leave Description"
                                            value={this.state.leavedescription}
                                            onChange={(event) => this.handleChange(event)}/><br/>
                                            </div>
                                            <li className="list-inline-item">
                                                <button
                                                    type="submit"
                                                    className="btn btn-default btn-lg"
                                                >
                                                    <i className="fa fa-level-up fa-fw"/>
                                                    <span className="network-name">Add Request</span>
                                                </button>
                                            </li>
                                            <li className="list-inline-item" style={{color:"#f00"}}>
                                                <a onClick={this.changeView}
                                                   className="btn btn-default btn-lg"
                                                >
                                                    <i className="fa fa-crosshairs"/>
                                                    <span className="network-name"> Cancel </span>
                                                </a>
                                            </li>
                                            <br/>
                                        </form>
                                        <h1 className="message">{this.state.info}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="loading" id="loader" style={{display:this.state.loaderCSS}}>Loading&#8230;</div>

                </div>

            );
        }
        else{
            if(this.state.details){
                return(
                    <div>
                        <NavBar data={"employee"}/>
                        <section id="about" className="masthead text-center">
                            <div className="intro-body text-center">
                                <div className="container">
                                    <div className="mx-auto">
                                        <div>
                                            <a onClick={this.changeView} className="list-inline-item">
                                                <button
                                                    type="submit"
                                                    className="btn btn-default btn-lg"
                                                >
                                                    <i className="fa fa-level-up fa-fw"/>
                                                    <span className="network-name">Add Request</span>
                                                </button>
                                            </a>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="panel panel-monthly">
                                                    <div className="panel-heading">
                                                        <h3 className="panel-title">Your Requests</h3>
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
                                            <div className="col-md-6">
                                                <div className="request-panel">
                                                    <table className="table">
                                                        <tr>
                                                            <td>Manager Username</td>
                                                            <td>{this.state.selecteditem['managerusername']}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>Leave Start Date</td>
                                                            <td>{this.state.selecteditem['date']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Leave End Date</td>
                                                            <td>{this.state.selecteditem['enddate']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total Requested Days</td>
                                                            <td>{this.state.selecteditem['daysnumber']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Leave Type</td>
                                                            <td>{this.state.selecteditem['leavetype']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Leave Description</td>
                                                            <td>{this.state.selecteditem['leavedescription']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Request Status</td>
                                                            <td>{this.state.selecteditem['requeststatus']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Manager Comments</td>
                                                            <td>{this.state.selecteditem['managercomment']}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Company Comments</td>
                                                            <td>{this.state.selecteditem['companycomment']}</td>
                                                        </tr>
                                                    </table>
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
            else{
                return(
                    <div>
                        <NavBar data={"employee"}/>
                        <section id="about" className="masthead text-center">
                            <div className="intro-body text-center">
                                <div className="container">
                                    <div className="mx-auto">
                                        <div>
                                            <a onClick={this.changeView} className="list-inline-item">
                                                <button
                                                    type="submit"
                                                    className="btn btn-default btn-lg"
                                                >
                                                    <i className="fa fa-level-up fa-fw"/>
                                                    <span className="network-name">Add Request</span>
                                                </button>
                                            </a>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="panel panel-monthly">
                                                    <div className="panel-heading">
                                                        <h3 className="panel-title">All Notifications</h3>
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
                                    </div>
                                </div>
                            </div>

                        </section>
                    </div>
                );
            }
        }
    }
}
export default AddRequest;