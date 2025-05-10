import {User, Mail, Lock, Eye, EyeOff} from 'lucide-react';

function StepOne({formData, errors, handleChange, showPassword, setShowPassword}) {

    const renderField = (type, name, label, placeholder, icon) => (
        <div>
            <label className="block text-sm font-medium text-primary">{label}</label>
            <div className="mt-1 relative">
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${icon && 'pl-11'} rounded-lg border ${errors[name] ?
                        'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                        focus:border-transparent focus:outline-none`}
                    placeholder={placeholder}
                />
                {icon}
                {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("text", "firstName", "First Name", "John")}
                {renderField("text", "lastName", "Last Name", "Doe")}
            </div>

            {renderField("text", "userName", "Username", "john doe",
                <User className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>)}
            {renderField("email", "email", "Email Address", "john.doe@example.com",
                <Mail className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>)}

            <div>
                <label className="block text-sm font-medium text-primary">Password</label>
                <div className="mt-1 relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border ${errors.password ?
                            'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                            focus:border-transparent focus:outline-none`}
                        placeholder="••••••••"
                    />
                    <Lock className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5 text-secondary"/>
                        ) : (
                            <Eye className="w-5 h-5 text-secondary"/>
                        )}
                    </button>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-primary">Confirm Password</label>
                <div className="mt-1 relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 rounded-lg border ${errors.confirmPassword ?
                            'border-red-500' : 'border-accent'} focus:ring-2 focus:ring-highlight 
                            focus:border-transparent focus:outline-none`}
                        placeholder="••••••••"
                    />
                    <Lock className="w-5 h-5 text-secondary absolute left-3 top-3.5"/>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
            </div>
        </div>
    );
}

export default StepOne;