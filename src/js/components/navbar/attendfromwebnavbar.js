import React, {Component} from "react";
import { Redirect, withRouter} from 'react-router-dom'
import '../../../HomeTemplate/vendor/bootstrap/css/bootstrap.min.css';
import '../../../HomeTemplate/vendor/font-awesome/css/font-awesome.min.css';
import '../../../HomeTemplate/css/grayscale.min.css';

//import {EMPLOYEE_API_URL} from "../../../config";
import '../../../css/custom.css';
//import axios from "axios/index";

class AttendFromWebNavBar extends Component {
    constructor(props){
        super(props);
        this.state= {
            logout: false
        };
        this.logout=this.logout.bind(this);
    }
    logout(){
        localStorage.clear()
        this.setState({
            logout:true
        });

    }

    render() {
        let boundCLick = this.logout.bind();
        if(this.state.logout){

            return(
                <Redirect to='/login/company/attendfromweb'/>
            );

        }
        else {
            return (
                <div className="nav">
                    <nav
                        className="navbar navbar-expand-lg navbar-light fixed-top"
                        id="mainNav"
                    >
                        <div className="container">
                            <a className="navbar-brand js-scroll-trigger" href="http://www.phuyal.co.uk/">
                                Phuyal Limited
                            </a>
                            <button
                                className="navbar-toggler navbar-toggler-right"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarResponsive"
                                aria-controls="navbarResponsive"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                Menu
                                <i className="fa fa-bars" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" onClick={boundCLick}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            );

        }
    }
}
export default withRouter(AttendFromWebNavBar);