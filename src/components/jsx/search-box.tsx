import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LocateIcon, Calendar } from 'lucide-react';


export const SearchBox = () => {
  return (
    <div className="flex space-x-2 bg-white p-4 rounded-lg shadow-md items-center justify-between">
      <div className="flex items-center border-2 rounded-lg border-gray-300">
        <LocateIcon className="m-2" />
        <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
      </div>
      <div className="flex items-center border-2 rounded-lg border-gray-300">
        <Calendar className="m-2" />
        <input
          className="p-2 outline-none"
          type="text"
          placeholder="Add start date"
        />
      </div>
      <div className="flex items-center border-2 rounded-lg border-gray-300">
        <Calendar className="m-2" />
        <input
          className="p-2 outline-none"
          type="text"
          placeholder="Add end date"
        />
      </div>
      <button className="bg-teal-500 text-white rounded-lg p-2 hover:bg-teal-600">
        Search
      </button>
    </div>
  );
};


