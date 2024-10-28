import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';
import { LabelTemplate, LabelDesign } from '../../types/labelManagement';

interface LabelDesignerProps {
  template: LabelTemplate;
  initialDesign?: LabelDesign;
  onSave: (design: Partial<LabelDesign>) => void;
}

function LabelDesigner({ template, initialDesign, onSave }: LabelDesignerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [elements, setElements] = useState(initialDesign?.elements || template.elements);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const handleElementSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleElementChange = (id: string, changes: any) => {
    setElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, ...changes } : el
      )
    );
  };

  const handleSave = () => {
    onSave({
      templateId: template.id,
      elements,
      version: (initialDesign?.version || 0) + 1,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Label Designer</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Design
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Stage
          ref={stageRef}
          width={template.dimensions.width}
          height={template.dimensions.height}
          style={{ background: 'white' }}
        >
          <Layer>
            {elements.map((element) => {
              const isSelected = element.id === selectedId;

              switch (element.type) {
                case 'text':
                  return (
                    <Text
                      key={element.id}
                      id={element.id}
                      x={element.position.x}
                      y={element.position.y}
                      width={element.size.width}
                      height={element.size.height}
                      text={element.content || 'Double click to edit'}
                      fontSize={element.style?.fontSize || 16}
                      fontFamily={element.style?.fontFamily || 'Arial'}
                      fill={element.style?.color || 'black'}
                      draggable={!element.locked}
                      onClick={() => handleElementSelect(element.id)}
                      onDblClick={(e) => {
                        const textNode = e.target;
                        // Create textarea for editing
                      }}
                    />
                  );
                case 'image':
                  return (
                    <Image
                      key={element.id}
                      id={element.id}
                      x={element.position.x}
                      y={element.position.y}
                      width={element.size.width}
                      height={element.size.height}
                      // image={} // Load image from URL
                      draggable={!element.locked}
                      onClick={() => handleElementSelect(element.id)}
                    />
                  );
                case 'shape':
                  return (
                    <Rect
                      key={element.id}
                      id={element.id}
                      x={element.position.x}
                      y={element.position.y}
                      width={element.size.width}
                      height={element.size.height}
                      fill={element.style?.fill || 'gray'}
                      stroke={element.style?.stroke || 'black'}
                      strokeWidth={element.style?.strokeWidth || 1}
                      draggable={!element.locked}
                      onClick={() => handleElementSelect(element.id)}
                    />
                  );
                default:
                  return null;
              }
            })}

            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Element Properties Panel */}
      {selectedId && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Element Properties</h3>
          {/* Add property controls based on element type */}
        </div>
      )}
    </div>
  );
}

export default LabelDesigner;