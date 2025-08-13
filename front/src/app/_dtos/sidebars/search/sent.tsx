'use client';

import { Checkbox, Slider } from 'antd';
import { VscFilter } from 'react-icons/vsc';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const onSliderChange =
  (searchParams: ReadonlyURLSearchParams, name: string) => (value: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(name);
    if (value > 0) {
      newSearchParams.set(name, value.toString());
    }

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

export const SentSidebar = () => {
  const searchParams = useSearchParams();
  const [shoppingChecked, setShoppingChecked] = useState(false);
  const [documentChecked, setDocumentChecked] = useState(false);
  const [cargoChecked, setCargoChecked] = useState(false);

  const updateTypeParams = (type: string, isChecked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (isChecked) {
      newSearchParams.set('type', type);
    } else {
      newSearchParams.delete('type');
    }
    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };
  const updateURLParams = (serviceType: string, isChecked: boolean) => {
    const searchParams = new URLSearchParams(window.location.search);
    const serviceTypeParams = searchParams.getAll('service_types');

    const newServiceTypes = serviceTypeParams.filter(
      (type) => type !== serviceType,
    );

    if (isChecked) {
      newServiceTypes.push(serviceType);
    }

    searchParams.delete('service_types');
    newServiceTypes.forEach((type) => {
      searchParams.append('service_types', type);
    });

    window.history.pushState(null, '', `?${searchParams.toString()}`);
  };
  const handleShoppingChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setShoppingChecked(isChecked);
    updateTypeParams('SHOPPING', isChecked);
  };
  const handleDocumentChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setDocumentChecked(isChecked);
    updateURLParams('DOCUMENT', isChecked);
  };
  const handleCargoChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setCargoChecked(isChecked);
    updateURLParams('VISIBLE_LOAD', isChecked);
  };

  return (
    <div className="flex flex-col gap-4 min-h-full bg-white p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <VscFilter className="text-xl" />
          <span className="font-bold">Filter by:</span>
        </div>
        <div className="flex flex-col gap-2">
          <Checkbox checked={shoppingChecked} onChange={handleShoppingChange}>
            Shopping
          </Checkbox>
          <Checkbox checked={documentChecked} onChange={handleDocumentChange}>
            Document
          </Checkbox>
          <Checkbox checked={cargoChecked} onChange={handleCargoChange}>
            Cargo
          </Checkbox>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Your Budget (per Kilo)</span>
        <Slider
          classNames={{
            track: 'bg-violet-600',
          }}
          onChangeComplete={onSliderChange(searchParams, 'cost')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Weight (kg)</span>
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
