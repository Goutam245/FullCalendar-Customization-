import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarEvent } from '@/types/calendar';
import { Trash2 } from 'lucide-react';
import { HexagonalColorPicker } from './HexagonalColorPicker';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  start?: Date;
  end?: Date;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
  uid: number;
}

const defaultColors = [
  '#3788d8',
  '#34a853',
  '#ff6d00',
  '#ea4335',
  '#9c27b0',
  '#808080',
];

const categories = [
  { id: 'meeting', label: 'Meeting', icon: '👥' },
  { id: 'phone', label: 'Phone Call', icon: '📞' },
  { id: 'appointment', label: 'Appointment', icon: '📅' },
  { id: 'alarm', label: 'Alarm', icon: '⏰' },
];

export const EventModal = ({
  open,
  onClose,
  event,
  start,
  end,
  onSave,
  onDelete,
  uid,
}: EventModalProps) => {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(
    event?.start || start?.toISOString().slice(0, 16) || ''
  );
  const [endTime, setEndTime] = useState(
    event?.end || end?.toISOString().slice(0, 16) || ''
  );
  const [color, setColor] = useState(event?.color || defaultColors[0]);
  const [category, setCategory] = useState(event?.category || '');
  const [photo, setPhoto] = useState(event?.photo || '');
  const [url, setUrl] = useState(event?.url || '');
  const [customColor, setCustomColor] = useState(color);

  const handleSave = () => {
    if (!title || !startTime || !endTime) return;

    onSave({
      uid,
      title,
      start: startTime,
      end: endTime,
      color,
      category,
      photo: photo || undefined,
      url: url || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const generateShades = (baseColor: string) => {
    // Convert hex to RGB
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const shades: string[] = [];
    for (let i = 0; i < 10; i++) {
      const factor = 0.25 + (i * 0.045); // 25% to 70%
      const newR = Math.round(r + (255 - r) * (1 - factor));
      const newG = Math.round(g + (255 - g) * (1 - factor));
      const newB = Math.round(b + (255 - b) * (1 - factor));
      shades.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    return shades;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Text</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">From</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end">To</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(category === cat.id ? '' : cat.id)}
                  className={`p-3 border rounded-lg text-sm flex flex-col items-center gap-1 transition-colors ${
                    category === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Stripe Color</Label>
            <Tabs defaultValue="colors" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="picker">Color Picker</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-3 pt-4">
                <div className="flex justify-center gap-3">
                  {defaultColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c, borderColor: 'white' }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="picker" className="pt-4">
                <HexagonalColorPicker
                  selectedColor={color}
                  onColorChange={setColor}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="photo">Image URL (optional)</Label>
            <Input
              id="photo"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {photo && (
              <img
                src={photo}
                alt="Event preview"
                className="mt-2 w-full h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex justify-between gap-2 pt-4">
            {event && onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            {!event && <div />}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Save</Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
