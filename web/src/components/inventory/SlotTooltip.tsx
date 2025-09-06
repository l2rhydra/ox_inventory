import { Inventory, SlotWithItem } from '../../typings';
import React, { Fragment, useMemo } from 'react';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from '../../store';
import ClockIcon from '../utils/icons/ClockIcon';
import { getItemUrl } from '../../helpers';
import Divider from '../utils/Divider';

const SlotTooltip: React.ForwardRefRenderFunction<
  HTMLDivElement,
  { item: SlotWithItem; inventoryType: Inventory['type']; style: React.CSSProperties }
> = ({ item, inventoryType, style }, ref) => {
  const additionalMetadata = useAppSelector((state) => state.inventory.additionalMetadata);
  const itemData = useMemo(() => Items[item.name], [item]);
  const ingredients = useMemo(() => {
    if (!item.ingredients) return null;
    return Object.entries(item.ingredients).sort((a, b) => a[1] - b[1]);
  }, [item]);
  const description = item.metadata?.description || itemData?.description;
  const ammoName = itemData?.ammoName && Items[itemData?.ammoName]?.label;

  const getItemRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'rare': return '#ffd700';
      case 'epic': return '#8a2be2';
      case 'legendary': return '#ff8c00';
      default: return '#ff0000';
    }
  };

  return (
    <>
      {!itemData ? (
        <div className="tooltip-wrapper" ref={ref} style={style}>
          <div className="tooltip-header-wrapper">
            <p>{item.name}</p>
          </div>
          <Divider />
          <p style={{ color: '#ff6666', fontSize: '12px' }}>Unknown item</p>
        </div>
      ) : (
        <div style={{ ...style }} className="tooltip-wrapper" ref={ref}>
          <div className="tooltip-header-wrapper">
            <div>
              <p style={{ color: getItemRarityColor(item.metadata?.rarity) }}>
                {item.metadata?.label || itemData.label || item.name}
              </p>
              {item.metadata?.rarity && (
                <div style={{ 
                  fontSize: '10px', 
                  color: getItemRarityColor(item.metadata.rarity),
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  marginTop: '2px'
                }}>
                  {item.metadata.rarity}
                </div>
              )}
            </div>
            {inventoryType === 'crafting' ? (
              <div className="tooltip-crafting-duration">
                <ClockIcon />
                <p>{(item.duration !== undefined ? item.duration : 3000) / 1000}s</p>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#888888' }}>{item.metadata?.type}</p>
            )}
          </div>
          
          <Divider />
          
          {description && (
            <div className="tooltip-description">
              <ReactMarkdown className="tooltip-markdown">{description}</ReactMarkdown>
            </div>
          )}
          
          {inventoryType !== 'crafting' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
              {item.durability !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc' }}>{Locale.ui_durability}:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff0000' }}>
                    {Math.trunc(item.durability)}%
                  </span>
                </div>
              )}
              
              {item.metadata?.ammo !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc' }}>{Locale.ui_ammo}:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff0000' }}>
                    {item.metadata.ammo}
                  </span>
                </div>
              )}
              
              {ammoName && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc' }}>{Locale.ammo_type}:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff0000' }}>
                    {ammoName}
                  </span>
                </div>
              )}
              
              {item.metadata?.serial && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc' }}>{Locale.ui_serial}:</span>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#ff0000' }}>
                    {item.metadata.serial}
                  </span>
                </div>
              )}
              
              {item.metadata?.components && item.metadata?.components[0] && (
                <div>
                  <div style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
                    {Locale.ui_components}:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {item.metadata.components.map((component: string, index: number) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '10px',
                          background: 'rgba(255, 0, 0, 0.2)',
                          color: '#ff6666',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 0, 0, 0.3)'
                        }}
                      >
                        {Items[component]?.label || component}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {item.metadata?.weapontint && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc' }}>{Locale.ui_tint}:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff0000' }}>
                    {item.metadata.weapontint}
                  </span>
                </div>
              )}
              
              {additionalMetadata.map((data: { metadata: string; value: string }, index: number) => (
                <Fragment key={`metadata-${index}`}>
                  {item.metadata && item.metadata[data.metadata] && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#cccccc' }}>{data.value}:</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff0000' }}>
                        {item.metadata[data.metadata]}
                      </span>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="tooltip-ingredients">
              <div style={{ 
                fontSize: '12px', 
                color: '#cccccc', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '1px'
              }}>
                Required Materials:
              </div>
              {ingredients &&
                ingredients.map((ingredient) => {
                  const [item, count] = [ingredient[0], ingredient[1]];
                  return (
                    <div className="tooltip-ingredient" key={`ingredient-${item}`}>
                      <img src={item ? getItemUrl(item) : 'none'} alt="ingredient" />
                      <p>
                        {count >= 1
                          ? `${count}x ${Items[item]?.label || item}`
                          : count === 0
                          ? `${Items[item]?.label || item}`
                          : count < 1 && `${count * 100}% ${Items[item]?.label || item}`}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default React.forwardRef(SlotTooltip);