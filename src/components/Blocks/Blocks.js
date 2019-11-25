import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import GridItem from 'components/Grid/GridItem';
import { actions, connect } from 'store';
import * as overlay from '../../components/loader';

const Blocks = ({ blocks }) => {
  const [selected,setSelected] = useState([]);
  const [memory,setMemory] = useState(0);

  useEffect(() => {
    if(blocks.data!==undefined){
      if(memory!==blocks.data.length){
        setMemory(blocks.data.length);
        let rows = blocks.data.map(()=>{
          return false;
        });
        setSelected(rows);
      }
    }
    console.log(selected,blocks.data);
  });

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
    return blocks.data.map((block,i) => {
      if (block.items_count < 1 || block.active === 0) {
        if (block.active === 0) {
          color = 'red';
        } else {
          color = 'grey';
        }
        disabled = true;
      } else {
        color = (selected[i]==true)?'white':'black';
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
                  color={selected[i]?"primary":"default"}
                  disabled={disabled}
                  onClick={
                    () => {
                      let temp = selected.map((d,index)=>{
                        if(i==index)
                          return true;
                        return false;
                      });
                      setSelected(temp);
                      overlay.showLoader();
                      actions.getItemsInBlock(block.mapped_string)
                    }
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
              color={selected[i]?"primary":"default"}
              onClick={(click) => {
                let temp = selected.map((d,index)=>{
                  if(i==index)
                    return true;
                  return false;
                });
                setSelected(temp);
                overlay.showLoader();
                actions.getItemsInBlock(block.mapped_string)
              }
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
