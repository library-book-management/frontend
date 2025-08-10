import React from 'react';
import { BiSearch, BiExport, BiPlus } from 'react-icons/bi';

type HeaderProps = {
  title: string;
  onKeywordChange?: (keyword: string) => void;
  onSearchClick?: () => void;
  onAddClick?: () => void;
};

const HeaderPage = (headerprops: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-12">
      <h1 className="text-2xl font-semibold">{headerprops.title}</h1>
      <div className="flex items-center justify-center h-[48px] gap-2">
        <div className="flex items-center justify-center h-[44px] border rounded-md focus-within:ring-2 focus-within:ring-purple-300">
          <input
            type="text"
            name="input-search"
            id="input-search"
            placeholder="Tìm kiếm"
            className="flex-1 p-2 rounded-l-md outline-none"
            onChange={(e) => headerprops.onKeywordChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                headerprops.onSearchClick?.();
              }
            }}
          />
          <button
            className="px-3 h-full border-l border-gray-300"
            onClick={headerprops.onSearchClick}
          >
            <BiSearch size={20} />
          </button>
        </div>
        {/* 
        <button className="w-[6em] h-[44px] rounded-md bg-violet-400 flex items-center justify-center hover:bg-violet-500 transition-all duration-150">
          <BiExport size={24} />
          <span>Xuất</span>
        </button> */}
        <button
          className="w-[6em] h-[44px] rounded-md bg-violet-500 flex items-center justify-center hover:bg-violet-600 transition-all duration-150 text-white"
          onClick={headerprops.onAddClick}
        >
          <BiPlus size={24} />
          <span>Thêm</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderPage;
