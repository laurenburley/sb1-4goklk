import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { SensoryAttribute, SensoryCategory } from '../../types/sensory';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FlavorWheelProps {
  attributes: SensoryAttribute[];
  scores?: Record<string, number>;
  onAttributeClick?: (attribute: SensoryAttribute) => void;
}

function FlavorWheel({ attributes, scores, onAttributeClick }: FlavorWheelProps) {
  const categories = Object.values(SensoryCategory);
  const categoryColors = {
    [SensoryCategory.APPEARANCE]: ['#fee2e2', '#fecaca', '#fca5a5'],
    [SensoryCategory.AROMA]: ['#dbeafe', '#bfdbfe', '#93c5fd'],
    [SensoryCategory.TASTE]: ['#dcfce7', '#bbf7d0', '#86efac'],
    [SensoryCategory.FINISH]: ['#fef3c7', '#fde68a', '#fcd34d'],
  };

  const data = {
    labels: attributes.map(attr => attr.name),
    datasets: [
      {
        data: attributes.map(attr => scores?.[attr.id] || 0),
        backgroundColor: attributes.map(attr => 
          categoryColors[attr.category as keyof typeof categoryColors][0]
        ),
        borderColor: attributes.map(attr => 
          categoryColors[attr.category as keyof typeof categoryColors][2]
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const attribute = attributes[context.dataIndex];
            return `${attribute.name}: ${context.formattedValue}/${attribute.maxScore}`;
          },
        },
      },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0 && onAttributeClick) {
        const index = elements[0].index;
        onAttributeClick(attributes[index]);
      }
    },
  };

  return (
    <div className="relative aspect-square">
      <Pie data={data} options={options} />
    </div>
  );
}

export default FlavorWheel;