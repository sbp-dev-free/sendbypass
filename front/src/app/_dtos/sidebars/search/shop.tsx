'use client';

import { Checkbox, Slider } from 'antd';
import { VscFilter } from 'react-icons/vsc';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

const onChange =
  (searchParams: ReadonlyURLSearchParams, itemType: string) =>
  (event: CheckboxChangeEvent) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    const itemTypesString = newSearchParams.get('item_type') || '';
    const itemTypesArray = itemTypesString ? itemTypesString.split(',') : [];

    if (event.target.checked) {
      if (!itemTypesArray.includes(itemType)) {
        itemTypesArray.push(itemType);
      }
    } else {
      const index = itemTypesArray.indexOf(itemType);
      if (index > -1) {
        itemTypesArray.splice(index, 1);
      }
    }

    if (itemTypesArray.length > 0) {
      newSearchParams.set('item_type', itemTypesArray.join(','));
    } else {
      newSearchParams.delete('item_type');
    }

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

const onSliderChange =
  (searchParams: ReadonlyURLSearchParams, param: string) => (value: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(param);
    if (value > 0) {
      newSearchParams.set(param, value.toString());
    }

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

export const ShopSidebar = () => {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-4 min-h-full bg-white p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <VscFilter className="text-xl" />
            <span className="font-bold">Filter by:</span>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox onChange={onChange(searchParams, 'do')}>
              Document
            </Checkbox>
            <Checkbox onChange={onChange(searchParams, 'cl')}>Cloth</Checkbox>
            <Checkbox onChange={onChange(searchParams, 'fo')}>Food</Checkbox>
            <Checkbox onChange={onChange(searchParams, 'el')}>
              Electronic Gadget
            </Checkbox>
            <Checkbox onChange={onChange(searchParams, 'ot')}>Other</Checkbox>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Your reward (per Kilo)</span>
        <Slider
          classNames={{
            track: 'bg-violet-600',
          }}
          onChangeComplete={onSliderChange(searchParams, 'cost')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Max wight (kg)</span>
        <Slider
          classNames={{
            track: 'bg-violet-600',
          }}
          onChangeComplete={onSliderChange(searchParams, 'weight')}
        />
      </div>
    </div>
  );
};
