import React, {Component} from "react";
import NavBar from '../navbar/employeeloggedinnavbar'
import EmployeeTable from './employeetables'


class EmployeeDashboard extends Component{


    render(){
        return(
            <div>
                <NavBar data={"employee"} />
                <EmployeeTable/>
            </div>
        );
    }
}

export default EmployeeDashboard;