import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 48;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const getInventoryIcon = (type: string) => {
    switch (type) {
      case 'player':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
      case 'shop':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        );
      case 'crafting':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
          </svg>
        );
    }
  };

  const getInventoryTitle = (type: string, label: string) => {
    switch (type) {
      case 'player':
        return 'POCKETS';
      case 'shop':
        return 'SHOP';
      case 'crafting':
        return 'CRAFTING';
      case 'container':
        return 'CONTAINER';
      case 'stash':
        return 'STASH';
      case 'trunk':
        return 'TRUNK';
      case 'glovebox':
        return 'GLOVEBOX';
      default:
        return label?.toUpperCase() || 'STORAGE';
    }
  };

  const getInventorySubtitle = (type: string) => {
    switch (type) {
      case 'player':
        return 'Items on your character';
      case 'shop':
        return 'Purchase items';
      case 'crafting':
        return 'Craft new items';
      case 'container':
        return 'Container storage';
      case 'stash':
        return 'Personal storage';
      case 'trunk':
        return 'Vehicle trunk';
      case 'glovebox':
        return 'Vehicle glovebox';
      default:
        return 'Storage container';
    }
  };

  return (
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div className="inventory-grid-header-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#ff0000' }}>
            {getInventoryIcon(inventory.type)}
          </div>
          <div>
            <p>{getInventoryTitle(inventory.type, inventory.label)}</p>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
              {getInventorySubtitle(inventory.type)}
            </div>
          </div>
        </div>
        {inventory.maxWeight && (
          <div style={{ textAlign: 'right' }}>
            <p>{weight / 1000}/{inventory.maxWeight / 1000}kg</p>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
              {Math.round((weight / inventory.maxWeight) * 100)}% full
            </div>
          </div>
        )}
      </div>
      
      <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
      
      <div className="inventory-grid-container" ref={containerRef}>
        {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
          <InventorySlot
            key={`${inventory.type}-${inventory.id}-${item.slot}`}
            item={item}
            ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
            inventoryType={inventory.type}
            inventoryGroups={inventory.groups}
            inventoryId={inventory.id}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;