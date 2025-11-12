import { Column, Row } from '@/components/controls/table/Table';
import TableActionButton from '@/components/controls/table/TableActionButton';
import TableIconDelete from '@/components/images/TableIconDelete';
import TableIconEdit from '@/components/images/TableIconEdit';

const DEFAULT_ACTION_BUTTON_WIDTH = 65;

export const createActionColumn = ({
  onEdit,
  onDelete,
  width,
}: {
  onEdit?: (row: Row) => void;
  onDelete?: (row: Row) => void;
  width?: number;
}): Column => ({
  accessor: 'actions',
  header: 'Actions',
  formatter: (_value, row) => (
    <div className="flex gap-2">
      {onEdit && (
        <TableActionButton Icon={TableIconEdit} onClick={() => onEdit(row)} />
      )}
      {onDelete && (
        <TableActionButton
          Icon={TableIconDelete}
          onClick={() => onDelete(row)}
        />
      )}
    </div>
  ),
  width:
    width ||
    Number(Number(Boolean(onEdit)) + Number(Boolean(onDelete))) *
      DEFAULT_ACTION_BUTTON_WIDTH,
});
