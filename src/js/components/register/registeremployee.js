import axios from "axios/index";
import React, {Component} from "react";
import { cognitoidentityserviceprovider } from "../../aws_profile";
import NavBar from "../navbar/adminloggedinnavbar";
//import {withRouter} from "react-router-dom";
import {COMPANY_API_URL, API_URL, FACE_UPLOAD_URL} from "../../../config";
import '../../../css/style.css';
import '../../../HomeTemplate/vendor/bootstrap/css/bootstrap.min.css';
import '../../../HomeTemplate/vendor/font-awesome/css/font-awesome.min.css';
import '../../../HomeTemplate/css/grayscale.min.css';
import '../../../css/custombootstrap.css';


//let API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/internattendance';
//let FACE_UPLOAD_URL = 'https://acqdzcwzj4.execute-api.eu-west-2.amazonaws.com/prod/uploadface';

class RegisterEmployee extends Component {
    constructor(props){
        super(props);
        this.state = {
            fullname:'',
            username:'',
            email:'',
            managerusername:'',
            position:'None',
            department:'None',
            imgSrc:[],
            info:'',
            forLoader:[],
            baseEncode:'',
            id:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }
    handleInputChange(event){
        var file = this.refs.file.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            var img=reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            this.setState({
                imgSrc: [reader.result],
                baseEncode: img,

            });
        }.bind(this);
        //console.log(url) // Would see a path?
        // TODO: concat files

    }
    getids(){
        var p=[];
        axios.get(API_URL, {
            params: {
                addNewIntern: "SendCredentials"
            }
        })
            .then(response => {
                this.setState({
                    employeeids: response.data.toString()
                });
                p=this.state.employeeids.split(",");
                this.setState({
                    id: p[2].replace(/\s+/, "")
                })

            })
            .catch(error => {
                console.log(error.toString())
            });

    }
    signUpEmployee({fullname, username, email}){
        this.getids()
        const p = new Promise((res, rej)=> {
            setTimeout(() => {
                var params = {
                    UserPoolId: this.state.id,
                    Username: username,
                    DesiredDeliveryMediums: [
                        "EMAIL"
                    ],
                    UserAttributes: [
                        {
                            Name: 'email',
                            Value: email
                        },
                        {
                            Name: 'name',
                            Value: fullname,
                        }

                    ]
                };
                console.log("creating");
                cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
                    if (err){
                        console.log(err);
                        rej(err);
                    }
                    else{
                        console.log("Got it");
                        console.log(data);
                        res(data);
                    }
                });
            }, 3000);
        });
        return p
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.state.username===''||this.state.imgSrc.length===0){
            this.setState({
                info: "Fill all fields properly"
            });
        }
        else {
            this.setState({
                info:'Please Wait',
                forLoader:[<div className="loader"></div>]
            });
            axios.get(COMPANY_API_URL, {
                headers:{
                    token: localStorage.getItem('companyIdToken')
                },
                params : {
                    param1: "RegisterEmployee",
                    param2: this.state.fullname,
                    param3: this.state.username+" "+this.state.position+" "+this.state.department,
                    param4: this.state.email,
                    param5: localStorage.getItem("adminname"),
                    param6: this.state.managerusername
                }
            })
                .then(response => {
                    console.log(response)
                    if(response.data==="Successfully Registered."){
                        axios.post(FACE_UPLOAD_URL, {
                            'intern_name': this.state.username.toLowerCase(),
                            'imgstr': this.state.baseEncode,
                            'company': localStorage.getItem("adminname")
                        })
                            .then(response => {
                                var msg = JSON.stringify(response.data);
                                console.log(response.data)
                                var j = msg.slice(1, -1);
                                this.setState({
                                    forLoader:[],
                                    username: '',
                                    email:'',
                                    fullname:'',
                                    imgSrc: [],
                                    info: j
                                });
                                setTimeout(() => {
                                    this.setState({
                                        info:''
                                    })
                                }, 5000);

                            })
                            .catch(error => {
                                this.setState({
                                    info: "There's an error in the request"
                                });
                            });
                    }
                    else{
                        //console.log(response.data)
                        this.setState({
                            info:response.data
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    /*localStorage.clear()
                    alert("Your Session Expired! Log in again...")
                    this.props.history.push('/login/company')*/

                });
        }
    }
    render() {
        console.log(this.state.managerusername)
        return(
            <div>
                <NavBar/>
                <header className="masthead">
                    <div className="intro-body">
                        <div className="container">
                            <div className="row" style={{paddingBottom:40}}>
                                <div className="col-md-6" style={{padding:25}}>
                                    <h3>Register New Employee</h3>
                                    <form onSubmit={this.handleSubmit} className="form-custom">
                                        <input
                                            name="fullname"
                                            type="text"
                                            placeholder="Employee fullname"
                                            value={this.state.fullname}
                                            onChange={(event) => this.handleChange(event)}/><br/>
                                        <input
                                            name="username"
                                            type="text"
                                            placeholder="Employee username"
                                            value={this.state.username}
                                            onChange={(event) => this.handleChange(event)}/><br/>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            value={this.state.email}
                                            onChange={(event) => this.handleChange(event)}/><br/>
                                        <input
                                            name="managerusername"
                                            type="managerusername"
                                            placeholder="Manager Username"
                                            value={this.state.managerusername}
                                            onChange={(event) => this.handleChange(event)}/><br/>

                                        <label>Position</label><br/>
                                        <select
                                            id="position"
                                            name="position"
                                            value={this.state.position}
                                            onChange={(event) => this.handleChange(event)}
                                        >
                                            <option value="None">None</option>
                                            <option value="Developer">Developer</option>
                                            <option value="SystemAdmin">SystemAdmin</option>
                                            <option value="QualityAssurance">QualityAssurance</option>
                                            <option value="Intern">Intern</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Other">Other</option>
                                        </select><br/>
                                        <label>Department</label><br/>
                                        <select
                                            id="department"
                                            name="department"
                                            value={this.state.department}
                                            onChange={(event) => this.handleChange(event)}

                                        >
                                            <option value="None">None</option>
                                            <option value="IT">IT</option>
                                            <option value="PoteStore">PoteStore</option>
                                            <option value="Business">Business</option>
                                            <option value="Administration">Administration</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Other">Other</option>
                                        </select><br/>

                                        <input
                                            ref="file"
                                            id="imgSrc"
                                            name="imgSrc"
                                            type="file"
                                            className="custom-file-upload"
                                            placeholder="Photo"
                                            onChange={(event) => this.handleInputChange(event)}
                                        />


                                        <li className="list-inline-item" style={{margin: 10, padding: 10, paddingLeft: 20, borderRadius: 10, width: 350}}>
                                            <button
                                                type="submit"

                                                className="btn btn-default btn-lg"
                                            >
                                                <i className="fa fa-level-up fa-fw" />
                                                <span className="network-name">Register</span>
                                            </button>
                                        </li>
                                    </form>
                                    <h1 className="message">{this.state.info}</h1>
                                </div>
                                <div className="col-md-6" style={{padding:25}}>
                                    <img className="fixedimg" src={this.state.imgSrc} alt=""/>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>
            </div>

        );
    }
}
export default RegisterEmployee;