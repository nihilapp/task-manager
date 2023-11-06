import React, { useCallback, useMemo, useState } from 'react';
import tw, { TwStyle, css } from 'twin.macro';
import { SerializedStyles } from '@emotion/react';
import { Icon } from '@iconify/react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Column, Task } from '@/src/types/entity.typs';

interface Props {
  column: Column;
  // eslint-disable-next-line no-unused-vars
  deleteColumn: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateColumn: (id: string, data: string) => void;
  // eslint-disable-next-line no-unused-vars
  createTask: (id: string) => void;
  tasks: Task[];
  styles?: TwStyle | SerializedStyles;
}

export function ColumnContainer({
  column, deleteColumn, updateColumn, createTask, tasks, styles,
}: Props) {
  const [ isEdit, setIsEdit, ] = useState(false);
  const [ newTitle, setNewTitle, ] = useState(column.title);

  // 전체 목록을 받아서 해당 컬럼의 태스크만 표시함.
  const columnTasks = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [ tasks, column, ]);

  const [ count, setCount, ] = useState(columnTasks.length);

  // 드래그앤 드랍에 필요한 여러가지 사항들을 제공해준다.
  // useSortable의 경우 배열에 어울린다.
  const {
    setNodeRef, attributes, listeners, transform, transition, isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const inlineStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(event.target.value);
    },
    []
  );

  const onClickEdit = useCallback(
    () => {
      if (isEdit) {
        updateColumn(column.id, newTitle);
        setIsEdit(false);
      } else {
        setIsEdit(true);
      }
    },
    [ column, isEdit, newTitle, ]
  );

  const style = {
    default: css([
      tw` w-[400px] h-[500px] bg-black-700 max-h-[500px] rounded-md flex flex-col border-2 border-black-700 `,
      isDragging && tw` bg-[#222222] border-rose-500 opacity-40 `,
      styles,
    ]),
    item: css([
      tw` flex flex-grow `,
    ]),
    top: css([
      tw` flex gap-2 items-stretch p-2 shrink-0 border-4 border-black-700 bg-black-800 rounded-2 `,
    ]),
    count: css([
      tw` text-white bg-[#222222] rounded px-2 font-900 flex items-center justify-center `,
    ]),
    button: css([
      tw` text-gray-400 text-[90%] hover:text-white bg-black-700 hover:bg-black-600 rounded p-2 flex items-center justify-center `,
    ]),
    buttons: css([
      tw` flex gap-2 `,
    ]),
    titleString: css([
      tw` flex items-center justify-start flex-1 shrink-0 border-2 border-transparent p-1 `,
    ]),
    titleInput: css([
      tw` flex items-center justify-start flex-1 shrink-0 w-full rounded border-2 border-rose-500 bg-black-base p-1 `,
    ]),
    addButton: css([
      tw` w-full rounded p-2 border-4 border-black-700 bg-black-800 text-white flex items-center justify-center gap-1 hover:bg-black-900/30 `,
    ]),
  };

  if (isDragging) {
    return (
      <div css={style.default} ref={setNodeRef} style={inlineStyle} />
    );
  }

  return (
    <>
      <div css={style.default} ref={setNodeRef} style={inlineStyle}>
        <div
          css={style.top}
        >
          <div
            css={style.button}
            {...attributes}
            {...listeners}
          >
            <Icon icon='fa6-solid:left-right' />
          </div>
          <div css={style.count}>{count}</div>
          {isEdit ? (
            <>
              <input
                type='text'
                value={newTitle}
                onChange={onChangeInput}
                css={style.titleInput}
              />
            </>
          ) : (
            <div css={style.titleString}>{column.title}</div>
          )}
          <div css={style.buttons}>
            <button
              aria-label='edit'
              onClick={onClickEdit}
              css={style.button}
            >
              <Icon icon={isEdit ? 'fa6-solid:check' : 'tabler:edit'} />
            </button>
            <button
              aria-label='delete'
              onClick={() => deleteColumn(column.id)}
              css={style.button}
            >
              <Icon icon='iconamoon:trash-fill' />
            </button>
          </div>
        </div>
        <div css={style.item}>content</div>
        <button aria-label='addTask' onClick={() => createTask(column.id)} css={style.addButton}>
          <Icon icon='typcn:plus' /> 메모 추가
        </button>
      </div>
    </>
  );
}
