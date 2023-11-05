import React, { useCallback, useState } from 'react';
import tw, { TwStyle, css } from 'twin.macro';
import { SerializedStyles } from '@emotion/react';
import { Icon } from '@iconify/react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Column } from '@/src/types/entity.typs';

interface Props {
  column: Column;
  // eslint-disable-next-line no-unused-vars
  deleteColumn: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateColumn: (id: string, data: string) => void;
  styles?: TwStyle | SerializedStyles;
}

export function ColumnContainer({
  column, deleteColumn, updateColumn, styles,
}: Props) {
  const [ isEdit, setIsEdit, ] = useState(false);
  const [ newTitle, setNewTitle, ] = useState(column.title);

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
      tw` w-[350px] h-[500px] bg-black-700 max-h-[500px] rounded-md flex flex-col border-2 border-black-700 `,
      isDragging && tw` bg-[#222222] border-rose-500 opacity-40 `,
      styles,
    ]),
    item: css([
      tw` flex flex-grow `,
    ]),
    top: css([
      tw` text-[1.2rem] cursor-grab rounded-md bg-black-800 rounded-b-0 border-4 p-3 border-black-700 flex items-center gap-2 `,
    ]),
    count: css([
      tw` flex justify-center items-center shrink-0 bg-black-700 text-[.8rem] px-2 py-1 rounded-full `,
    ]),
    title: css([
      tw` flex gap-2 shrink-0 flex-1 `,
    ]),
    delete: css([
      tw` text-gray-500 hover:text-white hover:bg-black-700 rounded px-1 py-2 `,
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
          {...attributes}
          {...listeners}
        >
          <div css={style.title}>
            <div css={style.count}>0</div>
            {isEdit ? (
              <>
                <input
                  type='text'
                  value={newTitle}
                  onChange={onChangeInput}
                  tw='shrink-0 w-[20px] outline-none bg-black-800 border-2 border-rose-500 rounded flex-1'
                />
              </>
            ) : (
              <div tw='flex-1 shrink-0'>{column.title}</div>
            )}
          </div>
          <div className='flex gap-1'>
            <button
              css={style.delete}
              aria-label='edit'
              onClick={onClickEdit}
            >
              <Icon icon={isEdit ? 'fa6-solid:check' : 'tabler:edit'} />
            </button>
            <button
              css={style.delete}
              aria-label='delete'
              onClick={() => deleteColumn(column.id)}
            >
              <Icon icon='iconamoon:trash-fill' />
            </button>
          </div>
        </div>
        <div css={style.item}>content</div>
        <div>footer</div>
      </div>
    </>
  );
}
