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
    let fontSize = 13;
    return blocks.data.map((block) => {
      if (block.block > 9 && block.rack > 9) {
        fontSize = 10.5;
      } else {
        if (block.block > 9 || block.rack > 9) {
          fontSize = 11.5;
        }   
      }
      if (maxLevels < 7 && block.level === maxLevels && maxLevels % 2 !== 0) {
        return (
          <React.Fragment key={block.id}>
            <GridItem xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5}}>
              <Badge color="primary" badgeContent={block.items_count}>
                <Button
                  variant="contained"
                  className="button"
                  style={{ fontSize }}
                  disabled={block.items_count > 0 ? false : true}
                  onClick={
                  () => actions.getItemsInBlock(block.mapped_string)
                }
                >
                  {block.mapped_string}
                </Button>
              </Badge>
            </GridItem>
            <GridItem xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5}}>
            </GridItem>
          </React.Fragment>
        );
      }

      return (
        <GridItem key={block.id} xs={blockWidth} sm={blockWidth} md={blockWidth} style={{ marginTop: 5}}>
          <Badge color="primary" badgeContent={block.items_count}>
            <Button
              variant="contained"
              className="button"
              style={{ fontSize }}
              disabled={block.items_count > 0 ? false : true}
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
