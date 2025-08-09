"use client"

import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListItem from './FormListItem';
import { LoadingCard } from '@/components/ui/loading';

function FormList() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetFormList();
    }
  }, [user]);

  const GetFormList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    try {
      setLoading(true);
      const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(JsonForms.id));

      setFormList(result);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
        {[...Array(6)].map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  if (formList.length === 0) {
    return (
      <div className='mt-10 text-center'>
        <div className='bg-blue-50 rounded-xl p-8 border-2 border-dashed border-blue-300'>
          <h3 className='text-lg font-semibold text-gray-600 mb-2'>No forms yet</h3>
          <p className='text-gray-500'>Create your first AI-powered form to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
      {
        formList.map((form, index) => (
          <div key={form.id}>
            <FormListItem
              jsonForm={form?.jsonform ? JSON.parse(form.jsonform) : {}}
              formRecord={form}
              refreshData={GetFormList}
            />
          </div>
        ))
      }
    </div>
  )
}

export default FormList