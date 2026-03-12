import { useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { buildInlineDiffSegments, buildTextDiffBlocks } from '../../lib/ui/appHelpers'

function buildSlateValue (beforeText, afterText) {
  const blocks = buildTextDiffBlocks(beforeText, afterText)

  if (!blocks.length) {
    return [
      {
        type: 'diff-block',
        diffType: 'same',
        label: '保留',
        children: [{ text: '当前没有检测到可展示的文本差异。', diffType: 'same' }]
      }
    ]
  }

  const nodes = []

  for (let index = 0; index < blocks.length; index += 1) {
    const currentBlock = blocks[index]
    const nextBlock = blocks[index + 1]
    const isReplacementPair =
      currentBlock?.type === 'removed' && nextBlock?.type === 'added'

    if (isReplacementPair) {
      const inlineSegments = buildInlineDiffSegments(currentBlock.text, nextBlock.text)

      nodes.push({
        type: 'diff-block',
        diffType: 'removed',
        label: '删除/替换前',
        children: inlineSegments.before.length
          ? inlineSegments.before.map((segment) => ({
              text: segment.text,
              diffType: 'removed',
              changed: segment.changed
            }))
          : [{ text: currentBlock.text, diffType: 'removed', changed: true }]
      })

      nodes.push({
        type: 'diff-block',
        diffType: 'added',
        label: '替换后',
        children: inlineSegments.after.length
          ? inlineSegments.after.map((segment) => ({
              text: segment.text,
              diffType: 'added',
              changed: segment.changed
            }))
          : [{ text: nextBlock.text, diffType: 'added', changed: true }]
      })

      index += 1
      continue
    }

    nodes.push({
      type: 'diff-block',
      diffType: currentBlock.type,
      label:
        currentBlock.type === 'added'
          ? '新增'
          : currentBlock.type === 'removed'
            ? '删除/替换'
            : '保留',
      children: [{ text: currentBlock.text, diffType: currentBlock.type, changed: currentBlock.type !== 'same' }]
    })
  }

  return nodes
}

function DiffElement ({ attributes, children, element }) {
  const className =
    element.diffType === 'added'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : element.diffType === 'removed'
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-slate-200 bg-slate-50 text-slate-700'

  return (
    <div {...attributes} className={`rounded-[1.25rem] border p-3 ${className}`}>
      <div contentEditable={false} className='mb-2 text-xs uppercase tracking-[0.24em] opacity-70'>
        {element.label}
      </div>
      <div className='whitespace-pre-wrap text-sm leading-6'>{children}</div>
    </div>
  )
}

function renderDiffLeaf ({ attributes, children, leaf }) {
  const className =
    leaf.changed && leaf.diffType === 'added'
      ? 'rounded bg-emerald-200/70 px-0.5'
      : leaf.changed && leaf.diffType === 'removed'
        ? 'rounded bg-rose-200/80 px-0.5 line-through'
        : ''

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  )
}

export function SlateDiffPanel ({ beforeText, afterText }) {
  const [editor] = useState(() => withReact(createEditor()))
  const value = buildSlateValue(beforeText, afterText)
  const slateKey = `${beforeText}__${afterText}`

  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap gap-2 text-xs'>
        <span className='rounded-full bg-emerald-100 px-3 py-1 text-emerald-700'>新增</span>
        <span className='rounded-full bg-rose-100 px-3 py-1 text-rose-700'>删除/替换</span>
        <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-600'>保留</span>
      </div>

      <div className='rounded-[1.25rem] bg-slate-100 p-3'>
        <Slate key={slateKey} editor={editor} initialValue={value}>
          <Editable
            readOnly
            renderElement={DiffElement}
            renderLeaf={renderDiffLeaf}
            disableDefaultStyles
            className='grid gap-3 outline-none'
          />
        </Slate>
      </div>
    </div>
  )
}
