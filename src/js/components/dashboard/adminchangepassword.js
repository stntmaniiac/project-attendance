import axios from "axios/index";
import React, {Component} from "react";

import NavBar from '../navbar/adminloggedinnavbar'
import {COMPANY_API_URL} from "../../../config";

class AdminChangePassword extends Component{
    constructor(props){
        super(props)
        this.state={
            info:'',
            oldpassword:'',
            newpassword:'',
            renewpassword:''
        };
        this.handleSubmitPassword=this.handleSubmitPassword.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmitPassword(){
        if(this.state.oldpassword===''||this.state.newpassword===''||this.state.renewpassword===''){
            this.setState({
                info:"Fill all the fields"
            })

        }
        else if(this.state.newpassword!==this.state.renewpassword){
            this.setState({
                info:"Password didnot match"
            })
        }
        else{
            axios.get(COMPANY_API_URL, {
                headers:{
                    token: localStorage.getItem("companyIdToken")
                },
                params: {
                    param1: "ChangePassword",
                    param2: this.state.oldpassword,
                    param3: this.state.renewpassword,
                    param4: localStorage.getItem("companyAccessToken")
                }
            })
                .then(response => {
                    console.log(response)
                    if(response.data!=="Success"){
                        this.setState({
                            info:response.data
                        })
                    }
                    else{
                        alert("Password Changed Successfully. Login again to continue")
                        localStorage.clear()
                        this.props.history.push('/login/company')
                    }


                })
                .catch(error => {
                    console.log(error)
                })
        }

    }
    render(){
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
                                    <div className="form-custom">
                                        <input
                                            type="password"
                                            name="oldpassword"
                                            value={this.state.oldpassword}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="Old Password"
                                            required="required"/><br/>
                                        <input
                                            type="password"
                                            name="newpassword"
                                            value={this.state.newpassword}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="New Password"
                                            required="required"/><br/>
                                        <input
                                            type="password"
                                            name="renewpassword"
                                            value={this.state.renewpassword}
                                            onChange={(event) => this.handleChange(event)}
                                            placeholder="Confirm New Password"
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
}

export default AdminChangePassword