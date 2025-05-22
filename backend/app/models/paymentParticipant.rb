class PaymentParticipant < ApplicationRecord
  belongs_to :payment
  belongs_to :user

  validates :share_amount, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :share_rate, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :paid_amount, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end