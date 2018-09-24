import axios from "axios/index";
import React, {Component} from "react";
import NavBar from '../navbar/homepagenavbar';
//import {CognitoUser, CognitoUserPool} from "amazon-cognito-identity-js";

//import {NavLink, withRouter} from 'react-router-dom';
import '../../../HomeTemplate/vendor/bootstrap/css/bootstrap.min.css';
import '../../../HomeTemplate/vendor/font-awesome/css/font-awesome.min.css';
import '../../../HomeTemplate/css/grayscale.min.css';
import {withRouter} from "react-router-dom";
import {API_URL} from "../../../config";

//let API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/internattendance';
class ForgotPassword extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            code:'',
            password:'',
            repassword:'',
            employeeids:'',
            id:{},
            passwordchangescreen:false
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleRequestCode=this.handleRequestCode.bind(this);
        this.handleSubmitPassword=this.handleSubmitPassword.bind(this);
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
                console.log(this.state.employeeids)
                p=this.state.employeeids.split(",");
                const employeePool={
                    UserPoolId: p[2].replace(/\s+/, ""),
                    ClientId: p[3]
                };
                this.setState({
                    id:employeePool
                })

            })
            .catch(error => {
                console.log(error.toString())
            });

    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }
    handleRequestCode(){
        this.getids()
        this.setState({
            info:"Please wait..."
        })
        axios.get(API_URL, {
            params:{
                addNewIntern: "RequestForgotPasswordCode",
                u: this.state.username,
                y: "employee"
            }
        })
            .then(response=>{

                console.log(response)
                if(response.data!=="Success"){
                    this.setState({
                        info:response.data
                    })
                }
                else{
                    this.setState({
                        info: '',
                        passwordchangescreen: true
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            })
        /*const p = new Promise((res, rej)=> {
            setTimeout(() => {
                try{
                    const adminUserPool = new CognitoUserPool(this.state.id)
                    var userData = {
                        Username: this.state.username,
                        Pool: adminUserPool
                    };
                    var cognitoUser = new CognitoUser(userData);
                    cognitoUser.forgotPassword({
                        onSuccess: function (result) {
                            alert("Password change successful")
                            console.log('call result: ' + result);
                        },
                        onFailure: function(err) {
                            console.log(err)
                            //alert(err.toString());
                        },
                        inputVerificationCode() {
                           /!* var verificationCode = prompt('Please input verification code ' ,'');
                            var newPassword = prompt('Enter new password ' ,'');
                            var reNewPassword=prompt('Reenter the password','');
                            if(newPassword!==reNewPassword){
                                alert('Password didnot match')
                            }
                            else{
                                cognitoUser.confirmPassword(verificationCode, newPassword, this);
                            }*!/
                           this.setState({

                           })

                        }
                    });
                }
                catch(err){
                    this.setState({
                        info:"Slow Connection. Try Again."
                    })
                }

            }, 10000);

        }).catch(error => {
            alert('Error')
        });

        return p;*/

    }
    handleSubmitPassword(){
        if(this.state.code===''||this.state.password===''||this.state.repassword===''){
            this.setState({
                info:"Fill all the fields"
            })

        }
        else if(this.state.password!==this.state.repassword){
            this.setState({
                info:"Password didnot match"
            })
        }
        else{
            this.setState({
                info:"Please wait..."
            })
            axios.get(API_URL, {
                params: {
                    addNewIntern: "ConfirmForgotPassword",
                    u: this.state.username,
                    y: this.state.code,
                    p: this.state.repassword,
                    t: "employee"
                }
            })
                .then(response => {

                    console.log(response)
                    alert("Password Changed Successfully. Login to continue")
                    this.props.history.push('/login/employee')
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }
    renderNewPassword(){
        let changepassword=this.handleSubmitPassword.bind()
        return(
            <div>
                <NavBar/>
                <header className="masthead">
                    <div className="intro-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 mx-auto" style={{marginTop: 150}}>
                                    <h3>Change Password</h3>
                                    <p>Check your registered email and get the confirmation code</p>
                                    <div className="form-custom">
                                        <input
                                            type="code"
                                            name="code"
                                            value={this.state.code}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="Verification Code"
                                            required="required"/><br/>
                                        <input
                                            type="password"
                                            name="password"
                                            value={this.state.password}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="Password"
                                            required="required"/><br/>
                                        <input
                                            type="password"
                                            name="repassword"
                                            value={this.state.repassword}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="Confirm Password"
                                            required="required"/><br/>
                                        <li className="list-inline-item" >
                                            <button
                                                onClick={changepassword}
                                                className="btn btn-default btn-lg"
                                            >
                                                <i className="fa fa-level-up fa-fw" />
                                                <span className="network-name">Change Password</span>
                                            </button>
                                        </li>
                                    </div>
                                    <h1 className="message">{this.state.info}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
    render(){
        if(this.state.passwordchangescreen){
            return this.renderNewPassword()
        }
        else {
            let passBoundClick = this.handleRequestCode.bind();
            return (
                <div>
                    <NavBar/>
                    <header className="masthead">
                        <div className="intro-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 mx-auto" style={{marginTop: 150}}>
                                        <h3>Forgot Password? Enter your username.</h3>
                                        <div className="form-custom">
                                            <input
                                                type="username"
                                                name="username"
                                                value={this.state.username}
                                                onChange={(event) => this.handleChange(event)}
                                                placeholder="Username"
                                                required="required"/><br/>

                                            <li className="list-inline-item">
                                                <button
                                                    onClick={passBoundClick}
                                                    className="btn btn-default btn-lg"
                                                >
                                                    <i className="fa fa-level-up fa-fw"/>
                                                    <span className="network-name">Send verification code</span>
                                                </button>
                                            </li>
                                        </div>
                                        <h1 className="message">{this.state.info}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

            )
        }
    }
}
export default withRouter(ForgotPassword);