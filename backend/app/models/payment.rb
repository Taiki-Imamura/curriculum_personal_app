class Payment < ApplicationRecord
  belongs_to :group, primary_key: 'uuid', foreign_key: 'group_uuid'

  has_many :payment_participants, dependent: :destroy
  has_many :participants, through: :payment_participants, source: :user
  has_many :payment_paypay_links, dependent: :destroy

  validates :title, presence: true
  validates :amount, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :paid_at, presence: true
end