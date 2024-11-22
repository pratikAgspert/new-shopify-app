import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, VStack, Stack, Tag } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const MotionBox = motion(Stack);

const SortableItem = ({ children, id, isDragDisabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    touchAction: 'none',
    minHeight: isDragging ? '1px' : 'auto',
    scale: isDragging ? 1.02 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <MotionBox
      ref={setNodeRef}
      style={style}
      initial={false}
      //   layout
      width="100%"
      spacing={0}
    >
      {children}
    </MotionBox>
  );
};

const DraggableSection = ({
  items,
  onReorder,
  renderItem,
  sectionTitle,
  isDragDisabled,
  isDisabled,
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
      disabled: isDisabled,
    })
  );

  const handleDragStart = (event) => {
    if (!isDisabled) {
      setActiveId(event?.active?.id);
    }
  };

  const handleDragEnd = (event) => {
    if (!isDisabled) {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        onReorder(arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  const handleDragCancel = () => {
    if (!isDisabled) {
      setActiveId(null);
    }
  };

  return (
    <VStack spacing={4} width="100%">
      {items?.length > 0 && sectionTitle && (
        <Tag
          bg="white"
          px={4}
          py={2}
          borderRadius="full"
          boxShadow="lg"
          fontSize="lg"
          fontWeight="semibold"
          textAlign="center"
        >
          {sectionTitle}
        </Tag>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToVerticalAxis]}
        disabled={isDisabled}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <VStack spacing={4} width="100%">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                isDragDisabled={isDragDisabled || isDisabled}
              >
                {renderItem(item)}
              </SortableItem>
            ))}
          </VStack>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <Box width="100%" opacity={1} pointerEvents="none" boxShadow="xl">
              {renderItem(items.find((item) => item.id === activeId))}
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </VStack>
  );
};

export default DraggableSection;
