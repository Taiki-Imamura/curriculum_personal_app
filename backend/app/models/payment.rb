class Payment < ApplicationRecord
  belongs_to :group
  belongs_to :payer, class_name: 'User', foreign_key: 'payer_id'

  has_many :payment_participants, dependent: :destroy
  has_many :participants, through: :payment_participants, source: :user

  validates :title, presence: true
  validates :amount, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :paid_at, presence: true
end