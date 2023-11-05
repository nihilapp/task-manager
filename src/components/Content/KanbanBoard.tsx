import React, { useCallback, useMemo, useState } from 'react';
import tw, { TwStyle, css } from 'twin.macro';
import { SerializedStyles } from '@emotion/react';
import { Icon } from '@iconify/react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Column } from '@/src/types/entity.typs';
import { Nihil } from '@/src/utils/nihil';
import { ColumnContainer } from './ColumnContainer';

interface Props {
  styles?: TwStyle | SerializedStyles;
}

export function KanbanBoard({ styles, }: Props) {
  const [ columns, setColumns, ] = useState<Column[]>([]);
  const columnsId = useMemo(() => {
    return columns.map((column) => column.id);
  }, [ columns, ]);

  const [ activeColumn, setActiveColumn, ] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // 드래그를 시작하고 어느정도 멀어져야 드래그 되는지 설정할 수 있다.
        distance: 10,
      },
    })
  );

  const onClickNewColumn = useCallback(
    () => {
      const newColumn: Column = {
        id: Nihil.uuid(),
        title: '새로운 컬럼',
      };

      setColumns((prev) => ([ ...prev, newColumn, ]));
    },
    []
  );

  const onChangeEdit = useCallback(
    (id: string, title: string) => {
      const newColumns = columns.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return { ...item, title, };
      });

      setColumns(newColumns);
    },
    [ columns, ]
  );

  const onClickDelete = useCallback(
    (id: string) => {
      console.log('삭제');
      setColumns((prev) => {
        return prev.filter((item) => item.id !== id);
      });
    },
    []
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      console.log('드래그 시작 >> ', event);
      if (event.active.data.current.type === 'Column') {
        setActiveColumn(event.active.data.current.column);
        return;
      }
    },
    []
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over, } = event;

      if (!over) {
        return;
      }

      const activeColumnId = active.id;
      const overColumnId = over.id;

      if (activeColumnId === overColumnId) {
        return;
      }

      setColumns((prev) => {
        const activeColumnIndex = prev.findIndex((col) => {
          return col.id === activeColumnId;
        });

        const overColumnIndex = prev.findIndex((col) => {
          return col.id === overColumnId;
        });

        return arrayMove(prev, activeColumnIndex, overColumnIndex);
      });
    },
    []
  );

  const style = {
    default: css([
      tw` m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] `,
      styles,
    ]),
    button: css([
      tw` h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-black-700 p-4 ring-rose-500 hover:ring-2 flex gap-2 items-center `,
    ]),
    container: css([
      tw` m-auto flex gap-4 `,
    ]),
    columns: css([
      tw` flex gap-4 `,
    ]),
  };

  return (
    <>
      <div css={style.default}>
        {/* 드래그를 위해서는 이게 필요하다. */}
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div css={style.container}>
            <div css={style.columns}>
              {/* 소팅을 위해서는 이게 필요하다. */}
              <SortableContext items={columnsId}>
                {columns.map((column) => (
                  <ColumnContainer
                    key={Nihil.uuid()}
                    column={column}
                    deleteColumn={onClickDelete}
                    updateColumn={onChangeEdit}
                  />
                ))}
              </SortableContext>
            </div>
            <button onClick={onClickNewColumn} css={style.button}>
              <Icon icon='typcn:plus' />
              추가
            </button>
          </div>

          {/* 드래그 할 때에 보이는 잔상 */}
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={onClickDelete}
                updateColumn={onChangeEdit}
                styles={tw` border-white `}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
