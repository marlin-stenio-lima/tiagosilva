import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../../lib/supabase';

// Initial structure for the columns
const initialColumns = {
  'col-1': { id: 'col-1', title: 'Novos', taskIds: [] },
  'col-2': { id: 'col-2', title: 'Em Contato', taskIds: [] },
  'col-3': { id: 'col-3', title: 'Proposta', taskIds: [] },
  'col-4': { id: 'col-4', title: 'Fechado', taskIds: [] },
};

const columnOrder = ['col-1', 'col-2', 'col-3', 'col-4'];

const AdminCRM = () => {
  const [data, setData] = useState({
    tasks: {},
    columns: initialColumns,
    columnOrder
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data: leads, error } = await supabase
        .from('crm_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tasksObj = {};
      const columnsObj = JSON.parse(JSON.stringify(initialColumns)); // deep copy

      if (leads && leads.length > 0) {
        leads.forEach(lead => {
          const taskId = lead.id;
          tasksObj[taskId] = {
            id: taskId,
            name: lead.name || 'Sem nome',
            empresa: lead.company || 'Não informado',
            email: lead.email || 'Não informado',
            phone: lead.phone || '',
            date: new Date(lead.created_at).toLocaleDateString('pt-BR')
          };
          
          const statusCol = lead.status || 'col-1';
          if (columnsObj[statusCol]) {
            columnsObj[statusCol].taskIds.push(taskId);
          } else {
            columnsObj['col-1'].taskIds.push(taskId);
          }
        });
      }

      setData({
        tasks: tasksObj,
        columns: columnsObj,
        columnOrder
      });
    } catch (error) {
      console.error('Erro ao buscar leads do Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    // UI Feedback is immediate (Optimistic UI)
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    // Update in Supabase
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ status: newFinish.id })
        .eq('id', draggableId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar status do lead no Supabase:', error);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div className="admin-page-header">
        <div>
          <h1>CRM Pipeline</h1>
          <p>Gerencie seus leads vindos do formulário de diagnóstico</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '1.5rem', flexGrow: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div 
                key={column.id} 
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '320px',
                  minWidth: '320px',
                  padding: '1.5rem',
                  background: 'rgba(15, 20, 25, 0.4)',
                  borderTop: column.id === 'col-4' ? '3px solid #22c55e' : (column.id === 'col-3' ? '3px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)')
                }}
              >
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {column.title} 
                  <span style={{ 
                    fontSize: '0.8rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: '#fff',
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}>
                    {tasks.length}
                  </span>
                </h3>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        flexGrow: 1,
                        minHeight: '150px',
                        transition: 'all 0.3s ease',
                        backgroundColor: snapshot.isDraggingOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                        border: snapshot.isDraggingOver ? '1px dashed rgba(59, 130, 246, 0.3)' : '1px dashed transparent',
                        borderRadius: '12px',
                        padding: '0.5rem'
                      }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: '1.2rem',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                zIndex: snapshot.isDragging ? 9999 : 1,
                                background: snapshot.isDragging ? '#1e293b' : '#11151c',
                                boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                                border: snapshot.isDragging ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                                transition: 'background-color 0.2s, box-shadow 0.2s, border-color 0.2s',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.05rem', fontWeight: '600' }}>{task.name}</h4>
                              <p style={{ margin: '0', fontSize: '0.9rem', color: '#a1a1aa' }}>{task.empresa}</p>
                              
                              <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                <span style={{ color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>{task.email}</span>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '100px', color: '#fff' }}>{task.date}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default AdminCRM;
