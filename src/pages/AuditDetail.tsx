import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, Plus, Trash2 } from 'lucide-react';

import { getAudit, getFindings, createFinding, updateFinding, deleteFinding } from '../lib/queries';
import { Audit, Finding, FINDING_STATUSES, RISK_LEVELS } from '../lib/types';

import { Layout } from '../components/Layout';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

export function AuditDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [audit, setAudit] = useState<Audit | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'findings'>(
    'overview'
  );

  const [showFindingModal, setShowFindingModal] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [findingForm, setFindingForm] = useState({
    finding_no: '',
    title: '',
    criteria: '',
    condition_text: '',
    root_cause: '',
    risk_impact: '',
    financial_impact: '',
    risk_rating: '',
    recommendation: '',
    management_response: '',
    responsible_person: '',
    target_date: '',
    status: 'Open',
  });

  // =========================
  // LOAD AUDIT & FINDINGS
  // =========================

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const auditData = await getAudit(id);

        if (!auditData) {
          setAudit(null);
          return;
        }

        setAudit(auditData);

        const findingsData = await getFindings(id);
        setFindings(findingsData || []);
      } catch (error) {
        console.error('Error loading audit:', error);

        setToast({
          message: 'Failed to load audit',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // =========================
  // FILTER FINDINGS
  // =========================

  const filteredFindings = findings
    .filter((finding) => {
      const query = searchQuery.toLowerCase().trim();

      if (!query) return true;

      return (
        finding.finding_no.toLowerCase().includes(query) ||
        finding.title.toLowerCase().includes(query)
      );
    })
    .filter((finding) =>
      filterRisk ? finding.risk_rating === filterRisk : true
    )
    .filter((finding) =>
      filterStatus ? finding.status === filterStatus : true
    );

  // =========================
  // RESET FORM
  // =========================

  const resetFindingForm = () => {
    setFindingForm({
      finding_no: '',
      title: '',
      criteria: '',
      condition_text: '',
      root_cause: '',
      risk_impact: '',
      financial_impact: '',
      risk_rating: '',
      recommendation: '',
      management_response: '',
      responsible_person: '',
      target_date: '',
      status: 'Open',
    });
  };

  // =========================
  // OPEN FINDING MODAL
  // =========================

  const handleOpenFindingModal = (finding?: Finding) => {
    if (finding) {
      setEditingFinding(finding);

      setFindingForm({
        finding_no: finding.finding_no,
        title: finding.title,
        criteria: finding.criteria || '',
        condition_text: finding.condition_text || '',
        root_cause: finding.root_cause || '',
        risk_impact: finding.risk_impact || '',
        financial_impact:
          finding.financial_impact !== null &&
          finding.financial_impact !== undefined
            ? String(finding.financial_impact)
            : '',
        risk_rating: finding.risk_rating || '',
        recommendation: finding.recommendation || '',
        management_response: finding.management_response || '',
        responsible_person: finding.responsible_person || '',
        target_date: finding.target_date || '',
        status: finding.status || 'Open',
      });
    } else {
      setEditingFinding(null);
      resetFindingForm();
    }

    setShowFindingModal(true);
  };

  // =========================
  // SAVE FINDING
  // =========================

  const handleSaveFinding = async () => {
    if (!id) {
      setToast({
        message: 'Audit ID is missing',
        type: 'error',
      });
      return;
    }

    if (!findingForm.finding_no.trim()) {
      setToast({
        message: 'Finding No is required',
        type: 'error',
      });
      return;
    }

    if (!findingForm.title.trim()) {
      setToast({
        message: 'Finding Title is required',
        type: 'error',
      });
      return;
    }

    try {
      const financialImpact = findingForm.financial_impact.trim()
        ? Number(findingForm.financial_impact)
        : null;

      if (
        financialImpact !== null &&
        Number.isNaN(financialImpact)
      ) {
        setToast({
          message: 'Financial Impact must be a valid number',
          type: 'error',
        });
        return;
      }

      const payload = {
        finding_no: findingForm.finding_no.trim(),
        title: findingForm.title.trim(),
        criteria: findingForm.criteria.trim() || null,
        condition_text: findingForm.condition_text.trim() || null,
        root_cause: findingForm.root_cause.trim() || null,
        risk_impact: findingForm.risk_impact.trim() || null,
        financial_impact: financialImpact,
        risk_rating: findingForm.risk_rating || null,
        recommendation: findingForm.recommendation.trim() || null,
        management_response:
          findingForm.management_response.trim() || null,
        responsible_person:
          findingForm.responsible_person.trim() || null,
        target_date: findingForm.target_date || null,
        status: findingForm.status,
      };

      if (editingFinding) {
        await updateFinding(editingFinding.id, payload);

        setToast({
          message: 'Finding updated successfully',
          type: 'success',
        });
      } else {
        await createFinding({
          ...payload,
          audit_id: id,
        });

        setToast({
          message: 'Finding created successfully',
          type: 'success',
        });
      }

      const updatedFindings = await getFindings(id);

      setFindings(updatedFindings || []);
      setShowFindingModal(false);
      setEditingFinding(null);
      resetFindingForm();
    } catch (error) {
      console.error('Error saving finding:', error);

      setToast({
        message: 'Failed to save finding',
        type: 'error',
      });
    }
  };

  // =========================
  // DELETE FINDING
  // =========================

  const handleDeleteFinding = async (findingId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this finding?'
    );

    if (!confirmed) return;

    try {
      await deleteFinding(findingId);

      setToast({
        message: 'Finding deleted successfully',
        type: 'success',
      });

      if (id) {
        const updatedFindings = await getFindings(id);
        setFindings(updatedFindings || []);
      }
    } catch (error) {
      console.error('Error deleting finding:', error);

      setToast({
        message: 'Failed to delete finding',
        type: 'error',
      });
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />

            <p className="mt-4 text-gray-600">
              Loading...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // =========================
  // AUDIT NOT FOUND
  // =========================

  if (!audit) {
    return (
      <Layout>
        <div className="p-8">
          <button
            onClick={() => navigate('/audits')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft size={20} />
            Back to Audits
          </button>

          <div className="rounded-lg bg-white p-8 shadow">
            <p className="text-gray-600">
              Audit not found.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <Layout>
      <div className="p-4 md:p-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/audits')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft size={20} />
          Back to Audits
        </button>

        {/* AUDIT INFORMATION */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow md:p-8">

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {audit.title}
            </h1>

            <p className="text-gray-600">
              {audit.audit_no}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

            <InfoField
              label="Company"
              value={audit.company || 'N/A'}
            />

            <InfoField
              label="Department"
              value={audit.department || 'N/A'}
            />

            <InfoField
              label="Audit Type"
              value={audit.audit_type || 'N/A'}
            />

            <InfoField
              label="Auditor"
              value={audit.auditor || 'N/A'}
            />

            <InfoField
              label="Start Date"
              value={audit.start_date || 'N/A'}
            />

            <InfoField
              label="End Date"
              value={audit.end_date || 'N/A'}
            />

            <InfoField
              label="Audit Period"
              value={audit.audit_period || 'N/A'}
            />

            <InfoField
              label="Risk Level"
              value={audit.risk_level || 'N/A'}
            />

            <div>
              <p className="text-sm font-medium text-gray-600">
                Status
              </p>

              <div className="mt-2">
                <Badge
                  text={audit.status}
                  color={getStatusColor(audit.status)}
                />
              </div>
            </div>
          </div>

          {audit.objective && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-600">
                Objective
              </p>

              <p className="mt-2 whitespace-pre-wrap text-gray-900">
                {audit.objective}
              </p>
            </div>
          )}

          {audit.scope && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-600">
                Scope
              </p>

              <p className="mt-2 whitespace-pre-wrap text-gray-900">
                {audit.scope}
              </p>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">

          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`border-b-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'findings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Findings ({findings.length})
          </button>

        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900">
              Audit Overview
            </h2>

            <p className="mt-2 text-gray-600">
              Review audit information and manage findings using the Findings tab.
            </p>
          </div>
        )}

        {/* FINDINGS */}
        {activeTab === 'findings' && (
          <div className="rounded-lg bg-white shadow">

            {/* HEADER */}
            <div className="border-b border-gray-200 p-6">

              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Audit Findings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredFindings.length} of {findings.length} findings
                  </p>
                </div>

                <button
                  onClick={() => handleOpenFindingModal()}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add Finding
                </button>

              </div>

              {/* SEARCH/FILTER */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <input
                  type="text"
                  placeholder="Search Finding No or Title"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filterRisk}
                  onChange={(e) =>
                    setFilterRisk(e.target.value)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    All Risk Levels
                  </option>

                  {RISK_LEVELS.map((risk) => (
                    <option key={risk} value={risk}>
                      {risk}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    All Statuses
                  </option>

                  {FINDING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Finding No
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Title
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Risk
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Financial Impact
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">

                  {filteredFindings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No findings found.
                      </td>
                    </tr>
                  ) : (
                    filteredFindings.map((finding) => {

                      const isOverdue =
                        finding.status !== 'Closed' &&
                        !!finding.target_date &&
                        new Date(finding.target_date) <
                          new Date();

                      return (
                        <tr
                          key={finding.id}
                          className="hover:bg-gray-50"
                        >

                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {finding.finding_no}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-900">
                            {finding.title}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <Badge
                              text={finding.risk_rating || 'N/A'}
                              color={getRiskColor(
                                finding.risk_rating
                              )}
                            />
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {finding.financial_impact !==
                              null &&
                            finding.financial_impact !==
                              undefined
                              ? `BDT ${Number(
                                  finding.financial_impact
                                ).toLocaleString()}`
                              : '-'}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm">

                            <div className="flex items-center gap-2">

                              <Badge
                                text={finding.status}
                                color={getStatusColor(
                                  finding.status
                                )}
                              />

                              {isOverdue && (
                                <Badge
                                  text="OVERDUE"
                                  color="red"
                                />
                              )}

                            </div>

                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm">

                            <div className="flex items-center gap-3">

                              <button
                                onClick={() =>
                                  handleOpenFindingModal(
                                    finding
                                  )
                                }
                                title="Edit Finding"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteFinding(
                                    finding.id
                                  )
                                }
                                title="Delete Finding"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>

            </div>
          </div>
        )}
      </div>

      {/* FINDING MODAL */}
      <Modal
        isOpen={showFindingModal}
        onClose={() => {
          setShowFindingModal(false);
          setEditingFinding(null);
          resetFindingForm();
        }}
        title={
          editingFinding
            ? 'Edit Finding'
            : 'Add Finding'
        }
        footer={
          <>
            <button
              onClick={() => {
                setShowFindingModal(false);
                setEditingFinding(null);
                resetFindingForm();
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveFinding}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {editingFinding
                ? 'Update Finding'
                : 'Save Finding'}
            </button>
          </>
        }
      >

        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">

          {/* Finding No + Title */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <FormInput
              label="Finding No *"
              value={findingForm.finding_no}
              onChange={(value) =>
                setFindingForm({
                  ...findingForm,
                  finding_no: value,
                })
              }
              placeholder="e.g. F-001"
            />

            <FormInput
              label="Title *"
              value={findingForm.title}
              onChange={(value) =>
                setFindingForm({
                  ...findingForm,
                  title: value,
                })
              }
              placeholder="Finding title"
            />

          </div>

          <FormTextarea
            label="Criteria"
            value={findingForm.criteria}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                criteria: value,
              })
            }
            placeholder="What should have happened?"
          />

          <FormTextarea
            label="Condition / Finding"
            value={findingForm.condition_text}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                condition_text: value,
              })
            }
            placeholder="What was actually found?"
          />

          <FormTextarea
            label="Root Cause"
            value={findingForm.root_cause}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                root_cause: value,
              })
            }
            placeholder="Why did this happen?"
          />

          <FormTextarea
            label="Risk / Impact"
            value={findingForm.risk_impact}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                risk_impact: value,
              })
            }
            placeholder="Risk or impact of the finding"
          />

          <FormInput
            label="Financial Impact (BDT)"
            type="number"
            value={findingForm.financial_impact}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                financial_impact: value,
              })
            }
            placeholder="0"
          />

          <FormSelect
            label="Risk Rating"
            value={findingForm.risk_rating}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                risk_rating: value,
              })
            }
            options={RISK_LEVELS}
            placeholder="Select Risk Rating"
          />

          <FormTextarea
            label="Recommendation"
            value={findingForm.recommendation}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                recommendation: value,
              })
            }
            placeholder="Recommended corrective action"
          />

          <FormTextarea
            label="Management Response"
            value={findingForm.management_response}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                management_response: value,
              })
            }
            placeholder="Management response"
          />

          <FormInput
            label="Responsible Person"
            value={findingForm.responsible_person}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                responsible_person: value,
              })
            }
            placeholder="Responsible person"
          />

          <FormInput
            label="Target Date"
            type="date"
            value={findingForm.target_date}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                target_date: value,
              })
            }
          />

          <FormSelect
            label="Status"
            value={findingForm.status}
            onChange={(value) =>
              setFindingForm({
                ...findingForm,
                status: value,
              })
            }
            options={FINDING_STATUSES}
          />

        </div>
      </Modal>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}

// ========================================
// FORM COMPONENTS
// ========================================

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// ========================================
// INFO FIELD
// ========================================

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-gray-900">
        {value}
      </p>
    </div>
  );
}

// ========================================
// STATUS COLOR
// ========================================

function getStatusColor(
  status: string
): 'red' | 'yellow' | 'green' | 'blue' | 'gray' {
  switch (status) {
    case 'Completed':
    case 'Closed':
      return 'green';

    case 'Ongoing':
    case 'In Progress':
      return 'blue';

    case 'Planned':
    case 'Management Response Pending':
      return 'yellow';

    case 'On Hold':
    case 'Open':
      return 'red';

    default:
      return 'gray';
  }
}

// ========================================
// RISK COLOR
// ========================================

function getRiskColor(
  risk?: string
): 'red' | 'yellow' | 'green' | 'blue' | 'gray' {
  switch (risk) {
    case 'High':
      return 'red';

    case 'Medium':
      return 'yellow';

    case 'Low':
      return 'green';

    default:
      return 'gray';
  }
}
