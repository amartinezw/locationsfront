import React from 'react';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import GridItem from 'components/Grid/GridItem';
import { actions, connect } from 'store';

const Blocks = ({ blocks }) => {
  if (blocks.data) {
    const maxLevels = Math.max.apply(Math, blocks.data.map((o) => o.level));
    let blockWidth;
    if (maxLevels < 7) {
      blockWidth = Math.round((12 / maxLevels));
    } else {
      blockWidth = 'auto';
    }
    let fontSize = 10.5;
    let color = 'black';
    let disabled = false;    
    return blocks.data.map((block) => {      
      if (block.items_count < 1 || block.active === 0) {
        if (block.active === 0) {
          color = 'red';
        } else {
          color = 'grey';
        }
        disabled = true;
      } else {
        color = 'black';
        disabled = false;
      }
      if (maxLevels < 7 && block.level === maxLevels && maxLevels % 2 !== 0) {
        return (
          <React.Fragment key={block.id}>
            <GridItem xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5 }}>
              <Badge color="primary" badgeContent={block.items_count}>
                <Button
                  variant="contained"
                  size="small"
                  className="button"
                  style={{ fontSize, color }}
                  disabled={disabled}
                  onClick={
                  () => actions.getItemsInBlock(block.mapped_string)
                }
                >
                  {block.mapped_string}
                </Button>
              </Badge>
            </GridItem>
            <GridItem xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5 }} />
          </React.Fragment>
        );
      }

      return (
        <GridItem key={block.id} xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5 }}>
          <Badge color="primary" badgeContent={block.items_count}>
            <Button
              variant="contained"
              className="button"
              size="small"
              style={{ fontSize, color }}
              disabled={disabled}
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
