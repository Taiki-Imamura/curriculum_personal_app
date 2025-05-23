class AddIsPayerToPaymentParticipants < ActiveRecord::Migration[8.0]
  def change
    add_column :payment_participants, :is_payer, :boolean, default: false, null: false
  end
end
