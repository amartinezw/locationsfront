import React from 'react';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import GridItem from 'components/Grid/GridItem';
import Typography from '@material-ui/core/Typography';
import { actions, connect } from 'store';

const Blocks = ({ blocks }) => {
  if (blocks.data) {
    const maxLevels = Math.max.apply(Math, blocks.data.map((o) => o.level));
    const blockWidth = Math.round((12 / maxLevels) * 10) / 10;
    let fontSize = 13;
    return blocks.data.map((block) => {
      if (block.block > 9) {
        fontSize = 11.5;
      }
      return (
        <GridItem key={block.id} xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5}}>
          <Badge color="primary" badgeContent={block.items_count}>
            <Button
              variant="contained"
              className="button"
              style={{ fontSize }}
              onClick={
              () => actions.getItemsInBlock(block.mapped_string)
            }
            >
              {block.mapped_string}
            </Button>
          </Badge>
        </GridItem>
      );
    });
  }
  return null;
};

export default connect(({ blocks }) => ({ blocks }))(Blocks);
