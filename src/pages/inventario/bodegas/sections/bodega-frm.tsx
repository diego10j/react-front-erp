import type { IideGeprov } from 'src/types/sistema/general';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect, useCallback } from "react";

import { paths } from 'src/routes/paths';

import { useFormTable } from "src/core/components/form";
import FormTable from "src/core/components/form/FormTable";
import { useDropdown } from 'src/core/components/dropdown';
import { useGetListDataCantones, useGetListDataProvincias } from 'src/api/sistema/general';

import { useGetBodega } from '../../../../api/inventario/bodegas';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------
type Props = {
  ide?: number;
};

// Esquema de validaciones formulario
export const Schema = zod.object({
  correo_inbod: zod
    .string()
    .transform((value) => value === '' ? null : value) // Transformar cadena vacía en null
    .nullable() // Permitir null
    .optional() // Permitir undefined
    .refine((value) => value === null || value === undefined || zod.string().email().safeParse(value).success, {
      message: 'Correo electrónico no válido!',
    })
});

export default function BodegaFRM({ ide = -1 }: Props) {

  const config = useGetBodega({ ide });
  const frmForm = useFormTable({ config });

  const droProvincias = useDropdown({ config: useGetListDataProvincias() });

  const [paramIdeGeprov, setParamIdeGeprov] = useState<IideGeprov>(
    {
      ide_geprov: -1
    }
  );

  const droCantones = useDropdown({ config: useGetListDataCantones(paramIdeGeprov) });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_empr', visible: false,
    },
    {
      name: 'inv_ide_inbod', visible: false,
    },
    {
      name: 'nivel_inbod', visible: false, formControlled: true, defaultValue: 'HIJO'
    },
    {
      name: 'activo_inbod', defaultValue: true,
    },
    {
      name: 'ide_geprov', label: 'Provincia', dropDown: droProvincias, order: 3
    },
    {
      name: 'ide_gecant', label: 'Canton', dropDown: droCantones, order: 4
    },
  ], [droProvincias, droCantones]);

  // Cuando es actualizacion carga el combo de cantones
  useEffect(() => {
    if (frmForm.currentValues) {
      const ideGeprov = frmForm.getValue('ide_geprov') || -1;
      if (ideGeprov !== paramIdeGeprov.ide_geprov) {
        setParamIdeGeprov({ ide_geprov: ideGeprov });
        droCantones.onRefresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frmForm.currentValues]);

  // Actualiza cantones
  useEffect(() => {
    if (droCantones.options.length > 0) {
      // Actualiza el dropdown 'ide_gecant' con los nuevos valores de 'droCantones'.
      frmForm.updateDropdown('ide_gecant', droCantones);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droCantones.options]);

  /**
   * Cuando selecciona una provincia carga sus cantones
   */
  const handleChangeProvincia = useCallback(() => {
    // Obtén el valor actual de 'ide_geprov' desde el formulario.
    const newIdeGeprov = frmForm.getValue('ide_geprov');
    // Set null a Canton
    frmForm.setValue('ide_gecant', '');
    // Actualiza el estado 'paramIdeGeprov' con el nuevo valor de 'ide_geprov'.
    setParamIdeGeprov({ ide_geprov: Number(newIdeGeprov) });
    droCantones.onRefresh();
  }, [droCantones, frmForm]);

  return (
    <FormTable
      ref={frmForm.formRef}
      useFormTable={frmForm}
      schema={Schema}
      hrefPath={paths.dashboard.inventario.bodegas.list}
      numSkeletonCols={14}
      customColumns={customColumns}
      eventsColumns={
        [
          {
            name: 'ide_geprov', onChange: handleChangeProvincia
          },
        ]
      }
    />
  );
}
