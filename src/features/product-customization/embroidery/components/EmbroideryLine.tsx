import { useTranslation } from '@/features/i18n/useTranslation/client';
import { LineFragment } from '@gql/graphql';

import { getEmbroideryText } from '../utils';
import { AddEmbroidery } from './AddEmbroidery';
import { DeleteEmbroidery } from './DeleteEmbroidery';
import { EditEmbroidery } from './EditEmbroidery';

export const EmbroideryLine = ({ line, inCheckout = false }: { line: LineFragment; inCheckout?: boolean }) => {
  const { t } = useTranslation(['shop']);
  const embroideryText = getEmbroideryText(line.attributes);

  if (!embroideryText) {
    return <AddEmbroidery lineId={line.id} inCheckout={inCheckout} />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-mono-500 text-sm">{t('shop:embroidery.label')}</span>
        <div className="flex gap-2">
          <EditEmbroidery lineId={line.id} currentText={embroideryText} inCheckout={inCheckout} />
          <DeleteEmbroidery lineId={line.id} inCheckout={inCheckout} />
        </div>
      </div>
      <span className="text-sm wrap-anywhere">{embroideryText}</span>
    </div>
  );
};
