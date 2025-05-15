import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useId, useMemo } from 'react';
import { FieldValues, Path, type Control } from 'react-hook-form';

interface ControlledInputProps <T extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isLoading?: boolean;
  required?: boolean;
  description?: string | React.ReactNode;
  props?: React.ComponentProps<'input'>;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  isLoading = false,
  required = false,
  description,
  ...props
}: ControlledInputProps<T>) {
  const id = useId();
  const fieldId = useMemo(() => (props?.id ? props.id : `field-${id}`), [props?.id, id]);

  return (
    <FormField
      control={control}
      name={name}
      rules={{required: required ? 'este campo é obrigatório' : false}}
      render={({field}) => {
        return (
          <FormItem className="relative w-full md:flex-1">
            {label && <FormLabel htmlFor={fieldId}>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <Input
                  required={required}
                  type={props?.type ?? 'text'}
                  autoComplete={props?.autoComplete}
                  disabled={!!props.disabled || isLoading}
                  step={props?.step}
                  id={fieldId}
                  placeholder={props?.placeholder}
                  accept={props?.accept}
                  className={cn(
                    {
                      'border-destructive': control.getFieldState(field.name).invalid,
                    },
                    props.className
                  )}
                  {...field}
                />
                {isLoading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
