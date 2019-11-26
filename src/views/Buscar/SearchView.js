/*eslint-disable*/
import React, { Component } from "react";
import Card from "components/Card/Card.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import SearchIcon from '@material-ui/icons/Search';
import ItemsInBlock from "components/ItemsInBlock/ItemsInBlock.js";
import LocatedInventory from "components/ItemsInBlock/LocatedInventory.js";
import { actions, connect } from 'store';

class Ubicaciones extends Component {
    constructor (props){
        super(props);
        this.serverApi = process.env.REACT_APP_API_LOCATION;   
    }

    componentDidMount() {
        
    }

    render() {        
        return (
            <Card>                                
                <GridContainer>                    
                    <GridItem xs={12} sm={12} md={12}>
                        <ItemsInBlock />                        
                    </GridItem>
                </GridContainer>
            </Card>
        );
    }
}
export default Ubicaciones;
