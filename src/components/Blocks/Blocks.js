import React from 'react';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import GridItem from "components/Grid/GridItem.js";
import Typography from '@material-ui/core/Typography';
import { actions, connect } from 'store';

const Blocks = ({ blocks }) => {
	if (blocks.data) {
		let sideB = false;
		let maxBlocks = Math.max.apply(Math, blocks.data.map(function(o) { return o.block; }));		
		let blockWidth = Math.round(12 / maxBlocks);
		return blocks.data.map(block => {
			if (block.side === 2 && sideB === false) {
				sideB = true;				
			    return <React.Fragment key={block.id}>
			     <GridItem xs={12} sm={12} md={12}>
			     	<Typography variant="h4" component="h4" gutterBottom>
		     	        Lado B
		     	    </Typography>
			     </GridItem>
			     <GridItem xs={12} sm={blockWidth} md={blockWidth}>			    
				    <Badge color="primary" badgeContent={block.items_count}>
				      	<Button variant="contained" className="button" onClick={() => actions.getItemsInBlock(block.mapped_string)}>
				       		{block.mapped_string}
				      	</Button>
				    </Badge>
				 </GridItem>
				</React.Fragment>			 
			} else {
				return <GridItem key={block.id} xs={blockWidth} sm={blockWidth} md={blockWidth}>
				   <Badge color="primary" badgeContent={block.items_count}>
				     	<Button variant="contained" className="button" onClick={() => actions.getItemsInBlock(block.mapped_string)}>
				      		{block.mapped_string}
				     	</Button>
				   </Badge>
				</GridItem>				
			}
		})
	} else {
		return null;
	}
}

export default connect(({ blocks }) => ({ blocks }))(Blocks)
