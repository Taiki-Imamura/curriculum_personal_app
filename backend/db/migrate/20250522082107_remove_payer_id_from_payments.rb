class RemovePayerIdFromPayments < ActiveRecord::Migration[8.0]
  def change
    remove_reference :payments, :payer, foreign_key: { to_table: :users }
  end
end
