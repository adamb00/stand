'use client';
import { inboundAction } from '@/actions/inbountAction';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InboundSchema } from '@/schemas/inboundSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Unit } from '@prisma/client';
import { SelectContent } from '@radix-ui/react-select';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

interface InboundPageProps {}

const InboundPage: React.FC<InboundPageProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (method: string) => {
    router.push(`/inbound?method=${method}`);
  };

  return (
    <section className='h-full w-full flex items-center justify-center'>
      <div className='rounded-md shadow-2xl px-10 gap-4 min-w-[50%] min-h-[50%] flex flex-col items-center justify-center'>
        {searchParams.get('method') === null && (
          <>
            <Button type='button' onClick={() => handleClick('manual')}>
              Kézi bevitel
            </Button>

            <div className='flex items-center w-full px-8'>
              <div className='flex-grow border-t border-gray-300' />
              <span className='mx-4 text-gray-500'>vagy</span>
              <div className='flex-grow border-t border-gray-300' />
            </div>

            <Button type='button' onClick={() => handleClick('invoice')}>
              Számlaszám alapján
            </Button>
          </>
        )}
        {searchParams.get('method') === 'manual' && <ManualMethod />}
      </div>
    </section>
  );
};

export default InboundPage;

const ManualMethod = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      products: [
        {
          name: '',
          quantity: null,
          unit: null,
          netUnitPrice: null,
        },
      ],
    },
    resolver: zodResolver(InboundSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  const handleSubmit = (values: z.infer<typeof InboundSchema>) => {
    startTransition(async () => {
      const res = await inboundAction(values);
      console.log(res);
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Kézi bevitel</h1>
      <Form {...form}>
        <form
          className='flex flex-col gap-4'
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex gap-2 items-center justify-center'
            >
              <FormField
                control={form.control}
                name={`products.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} label='Termék neve' required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.netUnitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        label='Nettó egységár'
                        required
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        label='Mennyiség'
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`products.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Egység' />
                        </SelectTrigger>
                        <SelectContent className='bg-primary rounded-md text-primary-foreground'>
                          <SelectGroup>
                            {Object.entries(Unit).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='button'
                variant='ghost'
                className='text-red-500'
                onClick={() => remove(index)}
              >
                ✕
              </Button>
            </div>
          ))}

          <div className='self-end flex gap-2'>
            <Button
              className='hover:text-primary-foreground hover:bg-primary'
              type='button'
              onClick={() =>
                append({
                  name: '',
                  quantity: null,
                  unit: null,
                  netUnitPrice: null,
                })
              }
              variant='outline'
            >
              Új sor hozzáadása
            </Button>
            <Button disabled={isPending} type='submit'>
              Mentés
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
