class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.references :group, null: false, foreign_key: true
      t.references :payer, null: false, foreign_key: { to_table: :users }
      t.string :title
      t.integer :amount
      t.datetime :paid_at

      t.timestamps
    end
  end
end
